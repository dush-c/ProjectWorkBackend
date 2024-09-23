import { Document } from 'mongoose';

export interface MovimentoContoCorrente extends Document {
    contoCorrenteID: number;
    data: Date;
    importo: number;
    saldo: number;
    categoriaMovimentoID: number;
    descrizioneEstesa?: string;
}