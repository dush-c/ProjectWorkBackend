import { IsNotEmpty, IsNumber, IsDate, IsString, IsOptional, Min } from 'class-validator';

export class MovimentoContoCorrenteDTO {
    @IsNotEmpty({ message: 'ContoCorrenteID è obbligatorio.' })
    @IsNumber({}, { message: 'ContoCorrenteID deve essere un numero.' })
    contoCorrenteID: number;

    @IsNotEmpty({ message: 'La data del movimento è obbligatoria.' })
    @IsDate({ message: 'Data deve essere un valore di tipo data.' })
    data: Date;

    @IsNotEmpty({ message: 'L\'importo è obbligatorio.' })
    @IsNumber({}, { message: 'Importo deve essere un numero.' })
    @Min(0, { message: 'L\'importo deve essere maggiore o uguale a 0.' })
    importo: number;

    @IsNotEmpty({ message: 'Il saldo è obbligatorio.' })
    @IsNumber({}, { message: 'Saldo deve essere un numero.' })
    saldo: number;

    @IsNotEmpty({ message: 'La categoria movimento ID è obbligatoria.' })
    @IsNumber({}, { message: 'CategoriaMovimentoID deve essere un numero.' })
    categoriaMovimentoID: number;

    @IsOptional() // La descrizione è opzionale
    @IsString({ message: 'Descrizione estesa deve essere una stringa.' })
    descrizioneEstesa?: string;
}
