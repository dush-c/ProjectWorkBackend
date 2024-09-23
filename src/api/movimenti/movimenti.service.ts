import { MovimentoModel, IMovimentoContoCorrente } from './movimenti.model';
import { MovimentoContoCorrenteDTO } from './movimenti.dto'; // DTO per la validazione
import { validate } from 'class-validator'; // Per eseguire la validazione dei dati di input
import { ContoCorrenteModel } from '../contoCorrente/contoCorrente.model'; // Modello del conto corrente per verificare l'ownership
import { ObjectId, Types } from 'mongoose';

class MovimentiService {
    // Metodo per verificare che l'utente sia associato al conto corrente
    private async verificaProprietarioConto(contoCorrenteID: string, userId: string): Promise<boolean> {
        console.log("conto corrente id: ", contoCorrenteID, "\nId utente: ", userId);
    
        const contoCorrente = await ContoCorrenteModel.findOne({
            _id: new Types.ObjectId(contoCorrenteID),
            userId: new Types.ObjectId(userId)  // Converti userId in ObjectId se necessario
        });
    
        console.log("Conto corrente: ", contoCorrente);
        return !!contoCorrente; // Restituisce true se l'utente è il proprietario del conto
    }
    

    // Recupera movimenti per conto corrente
    async getMovimenti(contoCorrenteID: string, n: number, userId: string): Promise<IMovimentoContoCorrente[] | string> {
        // Verifica che l'utente abbia accesso al conto
        // const proprietario = await this.verificaProprietarioConto(contoCorrenteID, userId);
        // if (!proprietario) {
        //     return 'Accesso negato: l\'utente non è autorizzato a visualizzare i movimenti di questo conto.';
        // }

        return MovimentoModel.find(new Types.ObjectId(contoCorrenteID))
            .sort({ data: -1 })
            .limit(n);
    }

    // Recupera movimenti per categoria
    async getMovimentiPerCategoria(contoCorrenteID: string, categoriaID: number, n: number, userId: string): Promise<IMovimentoContoCorrente[] | string> {
        return MovimentoModel.find(new Types.ObjectId(contoCorrenteID), { categoriaMovimentoID: categoriaID })
            .sort({ data: -1 })
            .limit(n);
    }

    // Recupera movimenti tra date
    async getMovimentiTraDate(contoCorrenteID: string, dataInizio: Date, dataFine: Date, n: number, userId: string): Promise<IMovimentoContoCorrente[] | string> {
        return MovimentoModel.find({
            contoCorrenteID: contoCorrenteID,
            data: {
                $gte: new Date(dataInizio), // Maggiore o uguale a dataInizio
                $lte: new Date(dataFine)    // Minore o uguale a dataFine
            }
        }).sort({ data: -1 }).limit(n);
    }

    // Creazione di un nuovo movimento, usando DTO per validare l'input
    async createMovimento(movimentoDTO: MovimentoContoCorrenteDTO, userId: string): Promise<IMovimentoContoCorrente | string[]> {
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
