import { Types } from 'mongoose';

export interface MovimentoContoCorrente {
    contoCorrenteID: string | Types.ObjectId;
    data: Date;
    importo: number;
    saldo: number;
    categoriaMovimentoID: string | Types.ObjectId;
    descrizioneEstesa?: string;
}

