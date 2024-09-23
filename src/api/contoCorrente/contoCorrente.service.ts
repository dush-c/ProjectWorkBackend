import { User } from "../user/user.entity";
import { ContoCorrenteModel } from "./contoCorrente.model";
import { ContoCorrente } from "./controCorrente.entity";
import * as bcrypt from "bcrypt";

export class ContoCorrenteService {
  async add(user: User, item: ContoCorrente): Promise<ContoCorrente> {
    item.dataApertura = new Date();
    // Ensure the IBAN is correctly generated
    const hashedPassword = await bcrypt.hash(item.password, 10);

    item.password = hashedPassword;
    const createdItem = await ContoCorrenteModel.create(item);
    return (await this._getById(createdItem.id))!;
  }

  private async _getById(itemId: string) {
    return ContoCorrenteModel.findOne({ _id: itemId});
  }

  async info(user: User){
    const contoCorrente = await this._getById(user.contoCorrenteId!.toString());
    return contoCorrente;
  }
}


export default new ContoCorrenteService();
