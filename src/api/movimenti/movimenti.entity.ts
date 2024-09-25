import { Types } from 'mongoose';

export interface MovimentoContoCorrente {
    contoCorrenteId: string | Types.ObjectId;
    data: Date;
    importo: number;
    saldo: number;
    categoriaMovimentoID: string | Types.ObjectId;
    descrizioneEstesa?: string;
}

