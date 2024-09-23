import { MovimentoModel, IMovimentoContoCorrente } from './movimenti.model';
import { MovimentoContoCorrenteDTO } from './movimenti.dto'; // DTO per la validazione
import { validate } from 'class-validator'; // Per eseguire la validazione dei dati di input
import { ContoCorrenteModel } from '../contoCorrente/contoCorrente.model'; // Modello del conto corrente per verificare l'ownership

class MovimentiService {
    // Metodo per verificare che l'utente sia associato al conto corrente
    private async verificaProprietarioConto(contoCorrenteID: number, userId: string): Promise<boolean> {
        const contoCorrente = await ContoCorrenteModel.findOne({ _id: contoCorrenteID, userId });
        return !!contoCorrente; // Restituisce true se l'utente è il proprietario del conto
    }

    // Recupera movimenti per conto corrente
    async getMovimenti(contoCorrenteID: number, n: number, userId: string): Promise<IMovimentoContoCorrente[] | string> {
        // Verifica che l'utente abbia accesso al conto
        const proprietario = await this.verificaProprietarioConto(contoCorrenteID, userId);
        if (!proprietario) {
            return 'Accesso negato: l\'utente non è autorizzato a visualizzare i movimenti di questo conto.';
        }

        return MovimentoModel.find({ contoCorrenteID })
            .sort({ data: -1 })
            .limit(n);
    }

    // Recupera movimenti per categoria
    async getMovimentiPerCategoria(contoCorrenteID: number, categoriaID: number, n: number, userId: string): Promise<IMovimentoContoCorrente[] | string> {
        // Verifica che l'utente abbia accesso al conto
        const proprietario = await this.verificaProprietarioConto(contoCorrenteID, userId);
        if (!proprietario) {
            return 'Accesso negato: l\'utente non è autorizzato a visualizzare i movimenti di questo conto.';
        }

        return MovimentoModel.find({ contoCorrenteID, categoriaMovimentoID: categoriaID })
            .sort({ data: -1 })
            .limit(n);
    }

    // Recupera movimenti tra date
    async getMovimentiTraDate(contoCorrenteID: number, dataInizio: Date, dataFine: Date, n: number, userId: string): Promise<IMovimentoContoCorrente[] | string> {
        // Verifica che l'utente abbia accesso al conto
        const proprietario = await this.verificaProprietarioConto(contoCorrenteID, userId);
        if (!proprietario) {
            return 'Accesso negato: l\'utente non è autorizzato a visualizzare i movimenti di questo conto.';
        }

        return MovimentoModel.find({
            contoCorrenteID,
            data: { $gte: dataInizio, $lte: dataFine }
        }).sort({ data: -1 }).limit(n);
    }

    // Creazione di un nuovo movimento, usando DTO per validare l'input
    async createMovimento(movimentoDTO: MovimentoContoCorrenteDTO, userId: string): Promise<IMovimentoContoCorrente | string[]> {
        // Verifica che l'utente abbia accesso al conto
        const proprietario = await this.verificaProprietarioConto(movimentoDTO.contoCorrenteID, userId);
        if (!proprietario) {
            return ['Accesso negato: l\'utente non è autorizzato a creare movimenti per questo conto.'];
        }

        // Validazione del DTO
        const validationErrors = await validate(movimentoDTO);
        if (validationErrors.length > 0) {
            return validationErrors.map(err => Object.values(err.constraints || {}).join(', '));
        }

        // Creazione dell'istanza da salvare nel DB usando l'entity
        const movimento = new MovimentoModel(movimentoDTO);
        return await movimento.save();
    }
}

export default new MovimentiService();
