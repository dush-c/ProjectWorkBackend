import mongoose from "mongoose";
import { ContoCorrente as iContoCorrente } from "./controCorrente.entity";


export const contoSchema = new mongoose.Schema<iContoCorrente>({
    username: { type: String },
    nomeTitolare: { type: String },
    cognomeTitolare: { type: String },
    password: { type: String},
    IBAN: { type: String, unique: false },
    dataApertura: { type: Date}
});


contoSchema.set("toJSON", {
    virtuals: true,
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    },
  });


export const ContoCorrenteModel = mongoose.model<iContoCorrente>("BankAccount", contoSchema);

