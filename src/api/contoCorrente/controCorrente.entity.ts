export interface ContoCorrente{
    id?: string;
    email: string;
    password: string;
    cognomeTitolare: string;
    nomeTitolare: string;
    dataApertura?: Date;
    IBAN: string;
}