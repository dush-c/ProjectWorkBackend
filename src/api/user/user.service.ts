import { User as UserModel } from "./user.model";
// import { UserIdentity as UserIdentityModel } from "../../utils/auth/local/user-identity.model";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";
import { UserIdentity } from "../../utils/auth/local/user-identity.model";
import { UserExistsError } from "../../errors/user-exist";

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

  async updateId(userId: string, contoId: string): Promise<User>{
    
    const user = await UserModel.findOne({ _id: userId, })
    // Step 6: Update the user with 'contoCorrenteId'
    user!.contoCorrenteId = contoId; 

    // Step 7: Save the updated user
    return await user!.save();


  }
}

export default new UserService();