import { Request, Response } from 'express';
import BonificoService from './bonifico.service';
import { BonificoDTO } from './bonifico.dto';
import { validate } from 'class-validator';  // Per validare il DTO

class BonificoController {
    async eseguiBonifico(req: Request, res: Response): Promise<Response> {
        const ip = req.ip;

        // Mappiamo i parametri dal corpo della richiesta
        const { ibanMittente, ibanDestinatario, importo } = req.body;

        // Verifica che i campi non siano undefined
        if (!ibanMittente || !ibanDestinatario || !importo) {
            return res.status(400).json({ message: 'Dati mancanti o incompleti.' });
        }

        // Creazione dell'istanza del DTO e validazione
        const bonificoDTO = new BonificoDTO();
        bonificoDTO.ibanMittente = ibanMittente;
        bonificoDTO.ibanDestinatario = ibanDestinatario;
        bonificoDTO.importo = Number(importo);

        const errors = await validate(bonificoDTO); // Validazione del DTO
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Errore di validazione', errors });
        }

        try {
            const result = await BonificoService.eseguiBonifico(bonificoDTO, ip);
            if (result.success) {
                return res.status(200).json({ message: result.message });
            }
            return res.status(400).json({ message: result.message });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: `Errore del server: ${error.message}` });
            }
            return res.status(500).json({ message: 'Errore sconosciuto' });
        }
    }
}

export default new BonificoController();
