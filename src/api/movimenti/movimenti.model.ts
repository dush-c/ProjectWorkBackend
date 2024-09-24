import mongoose, { Schema, Document, Types } from 'mongoose';

// Definisci l'interfaccia per il documento MovimentoContoCorrente
export interface IMovimentoContoCorrente extends Document{
    contoCorrenteID: { type: mongoose.Schema.Types.ObjectId, ref: "BankAccount" }
    data: Date;
    importo: number;
    saldo: number;
    categoriaMovimentoID:{ type: mongoose.Schema.Types.ObjectId, ref: "CategoriaMovimenti", default: null }
    descrizioneEstesa?: string;
}

// Schema di Mongoose
const MovimentoContoCorrenteSchema: Schema = new Schema({
    contoCorrenteID: { type: mongoose.Schema.Types.ObjectId, ref: "ContoCorrente", require:true },
    data: { type: Date, required: true },
    importo: { type: Number, required: true },
    saldo: { type: Number, required: true },
    categoriaMovimentoID: { type: mongoose.Schema.Types.ObjectId, required: true },
    descrizioneEstesa: { type: String }
});

// Esporta il modello MovimentoContoCorrente
export const MovimentoModel = mongoose.model<IMovimentoContoCorrente>('MovimentiContoCorrente', MovimentoContoCorrenteSchema);
