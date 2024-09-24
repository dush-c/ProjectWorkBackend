import { BonificoDTO } from './bonifico.dto'; 
import { ContoCorrenteModel } from '../contoCorrente/contoCorrente.model'; // Modello del conto corrente
import { MovimentoModel } from '../movimenti/movimenti.model'; // Vecchio modello per movimenti
import logService from '../services/logs/log.service';

class BonificoService {
    // Metodo per eseguire il bonifico
    async eseguiBonifico(bonificoDTO: BonificoDTO): Promise<{ success: boolean, message: string }> {
        const { ibanDestinatario, ibanMittente, importo } = bonificoDTO;

        // Verifica che l'IBAN destinatario esista
        const destinatario = await ContoCorrenteModel.findOne({ IBAN: ibanDestinatario });
        if (!destinatario) {
            logService.add("Transaction Error: IBAN not found", false);
            return { success: false, message: 'IBAN destinatario non trovato.' };
        }

        // Verifica che l'IBAN mittente esista
        const mittente = await ContoCorrenteModel.findOne({ IBAN: ibanMittente });
        if (!mittente) {
            logService.add("Transaction Error: IBAN not found", false);
            return { success: false, message: 'IBAN mittente non trovato.' };
        }

        // Recupera l'ultimo movimento per il mittente
        const ultimoMovimentoMittente = await MovimentoModel.findOne({ contoCorrenteID: mittente._id })
            .sort({ data: -1 }); // Prende l'ultimo movimento in ordine di data
        if (!ultimoMovimentoMittente || ultimoMovimentoMittente.saldo < importo) {
            logService.add("Transaction Error: Insufficent balance", false);
            return { success: false, message: 'Saldo insufficiente.' };
        }

        // Recupera l'ultimo movimento per il destinatario
        const ultimoMovimentoDestinatario = await MovimentoModel.findOne({ contoCorrenteID: destinatario._id })
            .sort({ data: -1 });

        // Esegui il bonifico: aggiorna il saldo dei conti
        const nuovoSaldoMittente = ultimoMovimentoMittente.saldo - importo;
        const nuovoSaldoDestinatario = ultimoMovimentoDestinatario ? ultimoMovimentoDestinatario.saldo + importo : importo;

        // Registra il movimento per il mittente
        const movimentoMittente = new MovimentoModel({
            contoCorrenteID: mittente._id,
            data: new Date(),
            importo: -importo,
            saldo: nuovoSaldoMittente,
            categoriaMovimentoID: 1, // ID della categoria per i bonifici, supponendo sia 1
            descrizioneEstesa: `Bonifico a ${ibanDestinatario}`
        });
        await movimentoMittente.save();

        // Registra il movimento per il destinatario
        const movimentoDestinatario = new MovimentoModel({
            contoCorrenteID: destinatario._id,
            data: new Date(),
            importo: importo,
            saldo: nuovoSaldoDestinatario,
            categoriaMovimentoID: 1, // ID della categoria per i bonifici ricevuti
            descrizioneEstesa: `Bonifico ricevuto da ${ibanMittente}`
        });
        await movimentoDestinatario.save();

        // Log dell'operazione
        logService.add("Transaction", true);
        return { success: true, message: 'Bonifico completato con successo.' };
    }

}

export default new BonificoService();
