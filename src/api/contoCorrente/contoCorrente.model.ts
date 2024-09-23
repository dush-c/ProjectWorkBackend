import mongoose from "mongoose";
import { ContoCorrente as iContoCorrente } from "./controCorrente.entity";
export const contoSchema = new mongoose.Schema<iContoCorrente>({
    email: { type: String },
    nomeTitolare: { type: String },
    cognomeTitolare: { type: String },
    password: { type: String},
    IBAN: { type: String, unique: false },
    dataApertura: { type: Date}
});

export const ContoCorrenteModel = mongoose.model<iContoCorrente>("BankAccount", contoSchema);

