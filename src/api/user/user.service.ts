import { User as UserModel } from "./user.model";
// import { UserIdentity as UserIdentityModel } from "../../utils/auth/local/user-identity.model";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";
import { UserIdentity } from "../../utils/auth/local/user-identity.model";
import { UserExistsError } from "../../errors/user-exist";
import { ContoCorrenteModel } from "../contoCorrente/contoCorrente.model";
import { PasswordMismatchError, SamePasswordError } from "../../errors/password";

export class UserService {
  async add(
    user: User,
    credentials: { username: string; password: string }
  ): Promise<User> {
    const existingIdentity = await UserIdentity.findOne({
      "credentials.username": credentials.username,
    });

    if (existingIdentity) {
      throw new UserExistsError();
    }
    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    const newUser = await UserModel.create(user);

    await UserIdentity.create({
      provider: "local",
      user: newUser._id,
      credentials: {
        username: credentials.username,
        hashedPassword,
      },
    });

    return newUser;
  }

  async list(): Promise<User[]> {
    const userList = await UserModel.find();
    return userList;
  }

  async updateId(userId: string, contoId: string): Promise<User> {
    const user = await UserModel.findOne({ _id: userId });
    // Step 6: Update the user with 'contoCorrenteId'
    user!.contoCorrenteId = contoId;

    // Step 7: Save the updated user
    return await user!.save();
  }

  async updatePassword(
    user: User,
    newPassword: string,
    confirmPassword: string
  ) {
      //TODO: aggiungere il confronto con i valori nel database
      if (newPassword !== confirmPassword) {
       throw new PasswordMismatchError();
      }
    //se entrambi i controlli vanno a buon fine aggiorno il valore del campo 'Password' di 'user'
    var existingIdentity = await UserIdentity.findOne({
      user: user.id!,
    });

    if(await this._comparePassword(newPassword, existingIdentity!.credentials.hashedPassword)){
      //se true le due password coincidono e non va bene
      throw new SamePasswordError();
    }

    var bankAccountInfo = await ContoCorrenteModel.findOne({
      _id: user.contoCorrenteId,
    });
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    bankAccountInfo!.password = hashedPassword;
    existingIdentity!.credentials.hashedPassword = hashedPassword;

    bankAccountInfo!.save();
    existingIdentity!.save();

    return await this._getById(user.id!);
  }

  private async _getById(userId: string) {
    return await UserModel.findOne({ _id: userId });
  }

  private async _comparePassword(notEncripted: string, enrcripted: string) {
    const match = await bcrypt.compare(notEncripted, enrcripted);
    return match;
  }
}

export default new UserService();
