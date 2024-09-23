import { Request, Response } from 'express';
import MovimentiService from './movimenti.service';
import { MovimentoContoCorrenteDTO } from './movimenti.dto'; // Import del DTO
import { validate } from 'class-validator'; // Per eseguire la validazione dei dati di input
import { Workbook } from 'exceljs';
import { parse } from 'json2csv';

class MovimentiController {
    // Metodo per ottenere i movimenti
    async getMovimenti(req: Request, res: Response): Promise<Response> {
        const user = req.user!;  // Ottieni l'utente autenticato
        const { contoCorrenteID } = req.params;
        const { n = 10, format = 'json' } = req.query;
    
        try {
            // Recupera i movimenti tramite il servizio
            const movimenti = await MovimentiService.getMovimenti(Number(contoCorrenteID), Number(n), user.id!);
            
            // Se non ci sono movimenti
            if (!movimenti.length) {
                return res.status(404).json({ message: `Nessun movimento trovato per il conto corrente con ID ${contoCorrenteID}.` });
            }
    
            // Generazione di Excel
            if (format === 'excel') {
                if (Array.isArray(movimenti) && movimenti.length > 0) {
                    const workbook = new Workbook();
                    const worksheet = workbook.addWorksheet('Movimenti');

                    // Aggiungi intestazioni
                    worksheet.columns = [
                        { header: 'ID', key: 'id', width: 10 },
                        { header: 'Data', key: 'data', width: 20 },
                        { header: 'Importo', key: 'importo', width: 15 },
                        { header: 'Saldo', key: 'saldo', width: 15 },
                        { header: 'Descrizione', key: 'descrizione', width: 30 },
                    ];

                    // Aggiungi i movimenti
                    movimenti.forEach(movimento => {
                        worksheet.addRow({
                            id: movimento.id,
                            data: movimento.data.toISOString(), // Assicurati che la data sia in formato leggibile
                            importo: movimento.importo,
                            saldo: movimento.saldo,
                            descrizione: movimento.descrizioneEstesa,
                        });
                    });

                    // Restituisci il file Excel
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.setHeader('Content-Disposition', 'attachment; filename=movimenti.xlsx');

                    await workbook.xlsx.write(res);
                    return res.end();
                } else {
                    return res.status(404).json({ message: 'Nessun movimento trovato.' });
                }
            }

            // Generazione di CSV
            if (format === 'csv') {
                if (Array.isArray(movimenti) && movimenti.length > 0) {
                    const csv = parse(movimenti.map(movimento => ({
                        id: movimento.id,
                        data: movimento.data.toISOString(), // Assicurati che la data sia in formato leggibile
                        importo: movimento.importo,
                        saldo: movimento.saldo,
                        descrizione: movimento.descrizioneEstesa,
                    })));

                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=movimenti.csv');
                    return res.send(csv);
                } else {
                    return res.status(404).json({ message: 'Nessun movimento trovato.' });
                }
            }

    
            // Ritorna i movimenti in formato JSON
            return res.json(movimenti);
        } catch (error) {
            return res.status(500).json({ message: error instanceof Error ? `Errore del server: ${error.message}` : 'Errore sconosciuto' });
        }
    }

    // Metodo per ottenere i movimenti per categoria
    async getMovimentiPerCategoria(req: Request, res: Response): Promise<Response> {
        const user = req.user!;
        const { contoCorrenteID, categoriaID, n } = req.params;
        const { format = 'json' } = req.query;

        try {
            const movimenti = await MovimentiService.getMovimentiPerCategoria(Number(contoCorrenteID), Number(categoriaID), Number(n), user.id!);
            if (!movimenti.length) {
                return res.status(404).json({ message: `Nessun movimento trovato per la categoria con ID ${categoriaID}.` });
            }
            
            if (format === 'excel') {
                return res.status(501).json({ message: 'Export in Excel non ancora implementato' });
            }
            return res.json(movimenti);
        } catch (error) {
            return res.status(500).json({ message: error instanceof Error ? `Errore del server: ${error.message}` : 'Errore sconosciuto' });
        }
    }

    // Metodo per ottenere i movimenti tra date
    async getMovimentiTraDate(req: Request, res: Response): Promise<Response> {
        const user = req.user!;
        const { contoCorrenteID } = req.params;
        const { dataInizio, dataFine, n = 10, format = 'json' } = req.query;

        try {
            const movimenti = await MovimentiService.getMovimentiTraDate(
                Number(contoCorrenteID),
                new Date(dataInizio as string),
                new Date(dataFine as string),
                Number(n),
                user.id!
            );

            if (!movimenti.length) {
                return res.status(404).json({ message: `Nessun movimento trovato tra ${dataInizio} e ${dataFine}.` });
            }
            
            if (format === 'excel') {
                return res.status(501).json({ message: 'Export in Excel non ancora implementato' });
            }
            return res.json(movimenti);
        } catch (error) {
            return res.status(500).json({ message: error instanceof Error ? `Errore del server: ${error.message}` : 'Errore sconosciuto' });
        }
    }

    // Metodo per creare un nuovo movimento
    async createMovimento(req: Request, res: Response): Promise<Response> {
        const user = req.user!;
        const movimentoDTO = new MovimentoContoCorrenteDTO();
        Object.assign(movimentoDTO, req.body);

        // Validazione del DTO
        const validationErrors = await validate(movimentoDTO);
        if (validationErrors.length > 0) {
            const errors = validationErrors.map(err => Object.values(err.constraints || {}).join(', '));
            return res.status(400).json({ message: 'Errore di validazione', errors });
        }

        try {
            const nuovoMovimento = await MovimentiService.createMovimento(movimentoDTO, user.id!);
            return res.status(201).json(nuovoMovimento);
        } catch (error) {
            return res.status(500).json({ message: error instanceof Error ? `Errore del server: ${error.message}` : 'Errore sconosciuto' });
        }
    }
}

export default new MovimentiController();
