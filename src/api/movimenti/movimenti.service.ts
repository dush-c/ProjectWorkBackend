import { MovimentoModel, IMovimentoContoCorrente } from './movimenti.model';
import { MovimentoContoCorrenteDTO } from './movimenti.dto'; // DTO per la validazione
import { validate } from 'class-validator'; // Per eseguire la validazione dei dati di input
import { UserModel } from '../user/user.model';

export class MovimentiService {
    // Metodo per verificare che l'utente sia associato al conto corrente
    private async verificaProprietarioConto(contoCorrenteID: string, userId: string): Promise<boolean> {
        const { ObjectId } = require('mongodb'); 
    
        const utente = await UserModel.findOne({
            contoCorrenteId: new ObjectId(contoCorrenteID),
            _id: new ObjectId(userId)  // Converti userId in ObjectId se necessario
        });
    
        return !!utente; // Restituisce true se l'utente è il proprietario del conto
    }
    

    // Recupera movimenti per conto corrente
    async getMovimenti(contoCorrenteID: string, n: number, userId: string): Promise<IMovimentoContoCorrente[] | string> {
        // Verifica che l'utente abbia accesso al conto
        const proprietario = await this.verificaProprietarioConto(contoCorrenteID, userId);
        if (!proprietario) {
            return 'Accesso negato: l\'utente non è autorizzato a visualizzare i movimenti di questo conto.';
        }

        const { ObjectId } = require('mongodb'); // Importa ObjectId

        // Converto la stringa in ObjectId
        const objectIdContoCorrente = new ObjectId(contoCorrenteID);
        
        // Faccio la query con l'ObjectId
        return await MovimentoModel.find({ contoCorrenteID: objectIdContoCorrente })
            .sort({ data: -1 })
            .limit(n);
    }

    // Recupera movimenti per categoria
    async getMovimentiPerCategoria(contoCorrenteID: string, categoriaID: string, n: number, userId: string): Promise<IMovimentoContoCorrente[] | string> {
        // Verifica che l'utente abbia accesso al conto
        const proprietario = await this.verificaProprietarioConto(contoCorrenteID, userId);
        if (!proprietario) {
            return 'Accesso negato: l\'utente non è autorizzato a visualizzare i movimenti di questo conto.';
        }

        const { ObjectId } = require('mongodb'); 
        return MovimentoModel.find({ contoCorrenteID: new ObjectId(contoCorrenteID), categoriaMovimentoID: new ObjectId(categoriaID) })
            .sort({ data: -1 })
            .limit(n);
    }

    // Recupera movimenti tra date
    async getMovimentiTraDate(contoCorrenteID: string, dataInizio: Date, dataFine: Date, n: number, userId: string): Promise<IMovimentoContoCorrente[] | string> {
        // Verifica che l'utente abbia accesso al conto
        const proprietario = await this.verificaProprietarioConto(contoCorrenteID, userId);
        if (!proprietario) {
            return 'Accesso negato: l\'utente non è autorizzato a visualizzare i movimenti di questo conto.';
        }

        const { ObjectId } = require('mongodb'); 
        return MovimentoModel.find({
            contoCorrenteID: new ObjectId(contoCorrenteID),
            data: {
                $gte: new Date(dataInizio), // Maggiore o uguale a dataInizio
                $lte: new Date(dataFine)    // Minore o uguale a dataFine
            }
        }).sort({ data: -1 }).limit(n);
    }

    // Funzione per ottenere l'ultimo movimento di un conto corrente
    async getUltimoMovimento(contoCorrenteID: string) {
        try {
            const { ObjectId } = require('mongodb'); 
            // Verifica che il contoCorrenteID sia un ObjectId valido
            const objectId = new ObjectId(contoCorrenteID);

            // Cerca l'ultimo movimento ordinato per data (dal più recente al meno recente)
            const ultimoMovimento = await MovimentoModel.findOne({ contoCorrenteID: objectId })
                .sort({ data: -1 }) // Ordina per data in ordine decrescente (il più recente)
                .exec();  // Esegui la query

            return ultimoMovimento; // Restituisce l'ultimo movimento, oppure null se non esiste
        } catch (error) {
            throw new Error(`Errore durante il recupero dell'ultimo movimento: ${error}`);
        }
    }

    // Creazione di un nuovo movimento, usando DTO per validare l'input
    async createMovimento(movimentoDTO: MovimentoContoCorrenteDTO, contoCorrenteID: string, userId: string): Promise<IMovimentoContoCorrente | string[]> {
        // Verifica che l'utente abbia accesso al conto
        const proprietario = await this.verificaProprietarioConto(contoCorrenteID, userId);
        if (!proprietario) {
            return ['Accesso negato: l\'utente non è autorizzato a visualizzare i movimenti di questo conto.'];
        }

        // Validazione del DTO
        const validationErrors = await validate(movimentoDTO);
        if (validationErrors.length > 0) {
            return validationErrors.map(err => Object.values(err.constraints || {}).join(', '));
        }

        const { ObjectId } = require('mongodb'); 
        // Assicurati di avere il campo contoCorrenteID definito nel DTO
        await movimentoDTO.setContoCorrenteID(String(contoCorrenteID));

        // Crea il movimento utilizzando il DTO
        const movimento = new MovimentoModel({
            ...movimentoDTO, // Usa l'operatore spread per copiare i campi dal DTO
            contoCorrenteID: new ObjectId(contoCorrenteID) // Imposta contoCorrenteID come ObjectId
        });

        // Salva il movimento
        return await movimento.save();
    }
}

export default new MovimentiService();
