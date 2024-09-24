import { IsNotEmpty, IsNumber, IsDate, IsString, IsOptional, Min, IsMongoId } from 'class-validator';

export class MovimentoContoCorrenteDTO {
    //@IsNotEmpty({ message: 'La data del movimento è obbligatoria.' })
    @IsMongoId({ message: 'contoCorrenteID deve essere un MongoId.' })
    contoCorrenteID: string;

    @IsNotEmpty({ message: 'La data del movimento è obbligatoria.' })
    @IsDate({ message: 'Data deve essere un valore di tipo data.' })
    data: Date;

    @IsNotEmpty({ message: 'L\'importo è obbligatorio.' })
    @IsNumber({}, { message: 'Importo deve essere un numero.' })
    importo: number;

    //@IsNotEmpty({ message: 'Il saldo è obbligatorio.' })
    @IsNumber({}, { message: 'Saldo deve essere un numero.' })
    @IsOptional()
    saldo: number;

    @IsNotEmpty({ message: 'La categoria movimento ID è obbligatoria.' })
    @IsMongoId({ message: 'categoriaMovimentoID deve essere un MongoId.' })
    categoriaMovimentoID: number;

    @IsOptional()
    @IsString({ message: 'Descrizione estesa deve essere una stringa.' })
    descrizioneEstesa?: string;

    // Metodo per aggiornare contoCorrenteID
    public setContoCorrenteID(newID: string): void {
        this.contoCorrenteID = newID;
    }
}


