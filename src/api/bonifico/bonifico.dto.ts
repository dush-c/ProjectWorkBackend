import { IsNotEmpty, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class BonificoDTO {
    @IsNotEmpty()
    @IsString()
    @Length(27, 27) // Lunghezza fissa per un IBAN italiano
    ibanMittente: string;

    @IsNotEmpty()
    @IsString()
    @Length(27, 27)
    ibanDestinatario: string;

    @IsNotEmpty()
    @IsPositive()
    importo: number;
}
