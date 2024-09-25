import { NextFunction, Request, Response } from 'express';
import MovimentiService from './movimenti.service';
import { MovimentoContoCorrenteDTO } from './movimenti.dto'; // Import del DTO
import { validate } from 'class-validator';
import { User } from '../user/user.entity';

// Metodo per ottenere i movimenti
export const getMovimenti = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try { 
        const user = req.user! as User;  // Ottieni l'utente autenticato
        const { n = 10} = req.query;

        // Recupera i movimenti tramite il servizio
        const movimenti = await MovimentiService.getMovimenti(String(user.contoCorrenteId), Number(n), user.id!);
        
        // Se non ci sono movimenti
        if (!movimenti.length) {
            return res.status(404).json({ message: `Nessun movimento trovato per il conto corrente con ID ${String(user.contoCorrenteId)}.` });
        }

        // Ritorna i movimenti in formato JSON
        return res.status(200).json(movimenti);
    } catch (error) {
        return res.status(500).json({ message: error instanceof Error ? `Errore del server: ${error.message}` : 'Errore sconosciuto' });
    }
}

export const getSaldo= async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try { 
        const user = req.user! as User;  // Ottieni l'utente autenticato

        // Recupera i movimenti tramite il servizio
        const saldo = await MovimentiService.getSaldo(String(user.contoCorrenteId), user.id!);
        
        // Se non ci sono movimenti
        if (!saldo.length) {
            return res.status(404).json({ message: `Nessun movimento trovato per il conto corrente con ID ${String(user.contoCorrenteId)}.` });
        }

        // Ritorna i movimenti in formato JSON
        return res.status(200).json(saldo);
    } catch (error) {
        return res.status(500).json({ message: error instanceof Error ? `Errore del server: ${error.message}` : 'Errore sconosciuto' });
    }
}

// Metodo per ottenere i movimenti per categoria
export const getMovimentiPerCategoria = async (req: Request, res: Response): Promise<Response> => {
    const user = req.user! as User;
    const { categoriaID} = req.params;
    const { n = 10} = req.query;

    try {
        const movimenti = await MovimentiService.getMovimentiPerCategoria(String(user.contoCorrenteId!), String(categoriaID), Number(n), user.id!);
        if (!movimenti.length) {
            return res.status(404).json({ message: `Nessun movimento trovato per la categoria con ID ${categoriaID}.` });
        }
        return res.json(movimenti);
    } catch (error) {
        return res.status(500).json({ message: error instanceof Error ? `Errore del server: ${error.message}` : 'Errore sconosciuto' });
    }
}

// Metodo per ottenere i movimenti tra date
export const getMovimentiTraDate = async (req: Request, res: Response): Promise<Response> => {
    const user = req.user! as User;
    const contoCorrenteID = user.contoCorrenteId!;
    const { dataInizio, dataFine, n = 10 } = req.query;

    try {
        const movimenti = await MovimentiService.getMovimentiTraDate(
            String(contoCorrenteID),
            new Date(dataInizio as string),
            new Date(dataFine as string),
            Number(n),
            user.id!
        );

        if (!movimenti.length) {
            return res.status(404).json({ message: `Nessun movimento trovato tra ${dataInizio} e ${dataFine}.` });
        }
        return res.json(movimenti);
    } catch (error) {
        return res.status(500).json({ message: error instanceof Error ? `Errore del server: ${error.message}` : 'Errore sconosciuto' });
    }
}

export const createMovimento = async (req: Request, res: Response): Promise<Response> => {
    const user = req.user! as User;  // Prende l'utente autenticato
    const movimentoDTO = new MovimentoContoCorrenteDTO();

    // Assegno i valori dal corpo della richiesta, ma escludo quelli che devono essere gestiti automaticamente
    Object.assign(movimentoDTO, req.body, {
        contoCorrenteID: String(user!.contoCorrenteId),  // Imposto il contoCorrenteID come stringa
        data: new Date()  // Imposto la data come la data corrente
    });

    // Validazione del DTO
    const validationErrors = await validate(movimentoDTO);
    if (validationErrors.length > 0) {
        const errors = validationErrors.map(err => Object.values(err.constraints || {}).join(', '));
        return res.status(400).json({ message: 'Errore di validazione', errors });
    }

    try {
        // Recupero l'ultimo movimento per calcolare il saldo attuale
        const ultimoMovimento = await MovimentiService.getUltimoMovimento(String(user!.contoCorrenteId));

        // Calcolo il saldo sommando o sottraendo l'importo
        movimentoDTO.saldo = ultimoMovimento 
            ? ultimoMovimento.saldo + movimentoDTO.importo
            : movimentoDTO.importo; // Se non ci sono movimenti precedenti, il saldo è uguale all'importo

        // Creazione del nuovo movimento
        const nuovoMovimento = await MovimentiService.createMovimento(movimentoDTO, String(user!.contoCorrenteId), user.id!);
        return res.status(201).json(nuovoMovimento);
    } catch (error) {
        return res.status(500).json({ message: error instanceof Error ? `Errore del server: ${error.message}` : 'Errore sconosciuto' });
    }
};

export const getMovimentiById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try { 
        const user = req.user! as User;  // Ottieni l'utente autenticato
        const { id} = req.params;

        // Recupera i movimenti tramite il servizio
        const movimento = await MovimentiService.getMovimentiById(String(user.contoCorrenteId), user.id!, id);
        
        // Se non ci sono movimenti
        if (movimento === null || typeof movimento === 'string') {
            return res.status(404).json({ message: `Nessun movimento trovato per il conto corrente con ID ${String(user.contoCorrenteId)} con ID ${id}.` });
        }
        // Ritorna i movimenti in formato JSON
        return res.status(200).json(movimento);
    } catch (error) {
        return res.status(500).json({ message: error instanceof Error ? `Errore del server: ${error.message}` : 'Errore sconosciuto' });
    }
}