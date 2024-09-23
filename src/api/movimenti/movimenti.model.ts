import mongoose, { Schema, Document } from 'mongoose';

// Definisci l'interfaccia per il documento MovimentoContoCorrente
export interface IMovimentoContoCorrente extends Document {
    contoCorrenteID: number;
    data: Date;
    importo: number;
    saldo: number;
    categoriaMovimentoID: number;
    descrizioneEstesa?: string;
}

// Schema di Mongoose
const MovimentoContoCorrenteSchema: Schema = new Schema({
    contoCorrenteID: { type: Number, required: true },
    data: { type: Date, required: true },
    importo: { type: Number, required: true },
    saldo: { type: Number, required: true },
    categoriaMovimentoID: { type: Number, required: true },
    descrizioneEstesa: { type: String }
});

// Esporta il modello MovimentoContoCorrente
export const MovimentoModel = mongoose.model<IMovimentoContoCorrente>('MovimentoContoCorrente', MovimentoContoCorrenteSchema);
