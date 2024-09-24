import { IsNotEmpty, IsNumber, IsDate, IsString, IsOptional, Min, IsMongoId } from 'class-validator';

export class MovimentoContoCorrenteDTO {
    @IsNotEmpty({ message: 'La data del movimento è obbligatoria.' })
    @IsMongoId({ message: 'ContoCorrenteID deve essere un MongoId.' })
    contoCorrenteID: string ;

    @IsNotEmpty({ message: 'La data del movimento è obbligatoria.' })
    @IsDate({ message: 'Data deve essere un valore di tipo data.' })
    data: Date;

    @IsNotEmpty({ message: 'L\'importo è obbligatorio.' })
    @IsNumber({}, { message: 'Importo deve essere un numero.' })
    @Min(0, { message: 'L\'importo deve essere maggiore o uguale a 0.' })
    importo: number;

    //@IsNotEmpty({ message: 'Il saldo è obbligatorio.' })
    @IsNumber({}, { message: 'Saldo deve essere un numero.' })
    @IsOptional()
    saldo: number;

    @IsNotEmpty({ message: 'La categoria movimento ID è obbligatoria.' })
    @IsMongoId({ message: 'ContoCorrenteID deve essere un MongoId.' })
    categoriaMovimentoID: number;

    @IsOptional()
    @IsString({ message: 'Descrizione estesa deve essere una stringa.' })
    descrizioneEstesa?: string;
}
