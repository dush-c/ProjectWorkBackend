import { Schema, model, Document } from 'mongoose';

// Definizione dell'interfaccia per il documento
interface ILogBonifico extends Document {
    indirizzoIP: string | undefined;
    dataOra: Date;
    esito: string;
}

// Definizione dello schema Mongoose
const LogBonificoSchema = new Schema<ILogBonifico>({
    indirizzoIP: { type: String, required: true },
    dataOra: { type: Date, required: true },
    esito: { type: String, enum: ['success', 'failure'], required: true },
});

// Modello Mongoose
export const LogBonificoModel = model<ILogBonifico>('LogBonifico', LogBonificoSchema);
