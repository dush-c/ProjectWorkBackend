import { BonificoDTO } from "./bonifico.dto";
import { ContoCorrenteModel } from "../contoCorrente/contoCorrente.model"; // Modello del conto corrente
import { MovimentoModel } from "../movimenti/movimenti.model"; // Vecchio modello per movimenti
import logService from "../services/logs/log.service";
import { User } from "../user/user.entity";
import { MovimentoContoCorrente } from "../movimenti/movimenti.entity";
import { UserModel } from "../user/user.model";

class BonificoService {
    // Metodo per eseguire il bonifico
    async eseguiBonifico(bonificoDTO: BonificoDTO, userId: string): Promise<{ success: boolean, message: string }> {
        let { ibanDestinatario, ibanMittente, importo, causale } = bonificoDTO;

    // Verifica che l'IBAN destinatario esista
    const destinatario = await ContoCorrenteModel.findOne({
      IBAN: ibanDestinatario,
    });
    if (!destinatario) {
      logService.add("Transaction Error: IBAN not found", false);
      return { success: false, message: "IBAN destinatario non trovato." };
    }

        
    // Verifica che l'IBAN mittente esista
    const mittente = await ContoCorrenteModel.findOne({ IBAN: ibanMittente });
    if (!mittente) {
      logService.add("Transaction Error: IBAN not found", false);
      return { success: false, message: "IBAN mittente non trovato." };
    }

    // Recupera l'ultimo movimento per il mittente
    const ultimoMovimentoMittente = await MovimentoModel.findOne({
      contoCorrenteId: mittente._id,
    }).sort({ data: -1 }); // Prende l'ultimo movimento in ordine di data
    if (!ultimoMovimentoMittente || ultimoMovimentoMittente.saldo < importo) {
        console.log("Ultimo movimento mittente:", ultimoMovimentoMittente);
        console.log("Saldo mittente:", ultimoMovimentoMittente?.saldo, "Importo bonifico:", importo);

        logService.add("Transaction Error: Insufficent balance", false);
      return { success: false, message: "Saldo insufficiente." };
    }

    // Recupera l'ultimo movimento per il destinatario
    const ultimoMovimentoDestinatario = await MovimentoModel.findOne({
      contoCorrenteId: destinatario._id,
    }).sort({ data: -1 });

        // Esegui il bonifico: aggiorna il saldo dei conti
        const nuovoSaldoMittente = ultimoMovimentoMittente.saldo - importo;
        const nuovoSaldoDestinatario = ultimoMovimentoDestinatario ? ultimoMovimentoDestinatario.saldo + importo : importo;

        if (causale!="" && causale!=null){
            causale = "Causale: "+ causale;
        }

        // Registra il movimento per il mittente
        const movimentoMittente = new MovimentoModel({
            contoCorrenteId: mittente._id,
            data: new Date(),
            importo: importo,
            saldo: nuovoSaldoMittente,
            categoriaMovimentoID: "66f180ef3af4b7f8c8ca9186", // ID della categoria per i bonifici, supponendo sia 1
            descrizioneEstesa: `Bonifico disposto a favore di: ${mittente.nomeTitolare}. ${causale}`
        });
        await movimentoMittente.save();

        // Registra il movimento per il destinatario
        const movimentoDestinatario = new MovimentoModel({
            contoCorrenteId: destinatario._id,
            data: new Date(),
            importo: importo,
            saldo: nuovoSaldoDestinatario,
            categoriaMovimentoID: "66f180ef3af4b7f8c8ca9185", // ID della categoria per i bonifici ricevuti
            descrizioneEstesa: `Bonifico disposto da: ${destinatario.nomeTitolare}. ${causale}`
        });
        await movimentoDestinatario.save();

    // Log dell'operazione
    logService.add("Transaction", true);
    return { success: true, message: "Bonifico completato con successo." };
  }
  //user, numero, operatore, taglio
  async eseguiRicarica(
    user: User,
    numero: string,
    operatore: string,
    taglio: number
  ): Promise<{ success: boolean; message: string }> {
    //devo andare a recuperare l'ultimo movimento per controllare la disponibilità del saldo
    const ultimoMovimento = await MovimentoModel.findOne({
      contoCorrenteId: user.contoCorrenteId!.toString(),
    }).sort({ data: -1 });

    if (!ultimoMovimento) {
      logService.add("Errore: ", false);
      return { success: false, message: "account non verificato" };
    }

    if (ultimoMovimento!.saldo < taglio) {
      logService.add("Errore: Saldo non sufficente", false);
      return { success: false, message: "Saldo non sufficente" };
    }

    const saldoAggiornato = ultimoMovimento!.saldo - taglio;
    //oggetto finale che deve essere caricato all'interno del db
    const movimentoUscita: MovimentoContoCorrente = {
      categoriaMovimentoID: "66f180ef3af4b7f8c8ca9189",
      contoCorrenteId: user.contoCorrenteId!,
      data: new Date(),
      importo: taglio,
      saldo: saldoAggiornato,
      descrizioneEstesa: `Ricarica telefonica a favore di ${operatore}`,
    };

    // console.log("movimento uscita: ", movimentoUscita);

    await MovimentoModel.create(movimentoUscita);

    logService.add("Ricarica telefonica", true);
    return { success: true, message: "Ricarica effettuata con successo" };
  }
    async getIBANByUserId(userId: string): Promise<string> {
        try {
          // Cerca l'utente senza popolare contoCorrenteID
          const user = await UserModel.findById(userId);

          if (!user) {
            throw new Error('Utente non trovato');
          }
      
          // Verifica se contoCorrenteID è presente e se è un ObjectId
          if (!user.contoCorrenteId) {
            throw new Error('Conto corrente non associato a questo utente');
          }
      
          // Se contoCorrenteID è un ObjectId, cerca il conto corrente nel database
          const contoCorrente = await ContoCorrenteModel.findById(user.contoCorrenteId);
          if (!contoCorrente) {
            throw new Error('Conto corrente non trovato');
          }
      
          // Restituisci l'IBAN
          return contoCorrente.IBAN;
        } catch (error) {
          console.error(error);
          return 'Errore nel recupero dell\'IBAN';
        }
      }
}

export default new BonificoService();
