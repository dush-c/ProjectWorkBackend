import { Types } from 'mongoose';

export interface MovimentoContoCorrente {
    contoCorrenteID: string;
    data: Date;
    importo: number;
    saldo: number;
    categoriaMovimentoID: number;
    descrizioneEstesa?: string;
}

