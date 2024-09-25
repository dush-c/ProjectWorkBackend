import mongoose, { Schema, Document, Types } from 'mongoose';
import { MovimentoContoCorrente as iMovimentoContoCorrente } from './movimenti.entity';


// Schema di Mongoose
const MovimentoContoCorrenteSchema: Schema = new Schema({
    contoCorrenteId: { type: mongoose.Schema.Types.ObjectId, ref: "ContoCorrente"},
    data: { type: Date, required: true },
    importo: { type: Number, required: true },
    saldo: { type: Number, required: true },
    categoriaMovimentoID: { type: mongoose.Schema.Types.ObjectId, ref: "CategoriaMovimento", required: true },
    descrizioneEstesa: { type: String }
});

// Esporta il modello MovimentoContoCorrente
export const MovimentoModel = mongoose.model<iMovimentoContoCorrente>('MovimentiContoCorrente', MovimentoContoCorrenteSchema);
