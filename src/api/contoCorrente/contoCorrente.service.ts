import { MovimentoContoCorrente } from "../movimenti/movimenti.entity";
import { MovimentoModel } from "../movimenti/movimenti.model";
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

  async AperturaConto(user: User){

    const contoId = user.contoCorrenteId!;

    const aperturaConto: MovimentoContoCorrente = {
      categoriaMovimentoID: "66f180ef3af4b7f8c8ca9184",
      contoCorrenteId: contoId.toString(),
      data: new Date(),
      importo: 0,
      saldo: 0,
      descrizioneEstesa: "Apertura Conto"
    }

    console.log("Apertura conto",aperturaConto);
    
    return await MovimentoModel.create(aperturaConto);
  }
}


export default new ContoCorrenteService();
