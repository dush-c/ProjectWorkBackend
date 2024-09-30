import { MovimentoModel } from "./movimenti.model";
import { MovimentoContoCorrenteDTO } from "./movimenti.dto"; // DTO per la validazione
import { validate } from "class-validator"; // Per eseguire la validazione dei dati di input
import { UserModel } from "../user/user.model";
import { MovimentoContoCorrente } from "./movimenti.entity";

export class MovimentiService {
  // Metodo per verificare che l'utente sia associato al conto corrente
  private async verificaProprietarioConto(
    contoCorrenteId: string,
    userId: string
  ): Promise<boolean> {
    const { ObjectId } = require("mongodb");

    const utente = await UserModel.findOne({
      contoCorrenteId: new ObjectId(contoCorrenteId),
      _id: new ObjectId(userId), // Converti userId in ObjectId se necessario
    });

    return !!utente; // Restituisce true se l'utente è il proprietario del conto
  }

  // Recupera movimenti per conto corrente
  async getMovimenti(
    contoCorrenteId: string,
    n: number,
    userId: string
  ): Promise<MovimentoContoCorrente[] | string> {
    // Verifica che l'utente abbia accesso al conto
    const proprietario = await this.verificaProprietarioConto(
      contoCorrenteId,
      userId
    );


    if (!proprietario) {
      return "Accesso negato: l'utente non è autorizzato a visualizzare i movimenti di questo conto.";
    }

    const { ObjectId } = require("mongodb"); // Importa ObjectId

    // Converto la stringa in ObjectId
    const objectIdContoCorrente = new ObjectId(contoCorrenteId);

    // Faccio la query con l'ObjectId
    return await MovimentoModel.find({ contoCorrenteId: objectIdContoCorrente })
      .populate("categoriaMovimentoID")
      .sort({ data: -1 })
      .limit(n)
      ;
  }

  // Recupera movimenti per conto corrente
  async getSaldo(
    contoCorrenteId: string,
    userId: string
  ): Promise<MovimentoContoCorrente[] | string> {
    // Verifica che l'utente abbia accesso al conto
    const proprietario = await this.verificaProprietarioConto(
      contoCorrenteId,
      userId
    );
    if (!proprietario) {
      return "Accesso negato: l'utente non è autorizzato a visualizzare i movimenti di questo conto.";
    }

    const { ObjectId } = require("mongodb"); // Importa ObjectId

    // Converto la stringa in ObjectId
    const objectIdContoCorrente = new ObjectId(contoCorrenteId);


    return await MovimentoModel.find({ contoCorrenteId: objectIdContoCorrente })
  .sort({ data: -1 })
  .select('saldo');  // Seleziona solo il campo 'saldo'    
  }

  // Recupera movimenti per categoria
  async getMovimentiPerCategoria(
    contoCorrenteId: string,
    categoriaID: string,
    n: number,
    userId: string
  ): Promise<MovimentoContoCorrente[] | string> {
    // Verifica che l'utente abbia accesso al conto
    const proprietario = await this.verificaProprietarioConto(
      contoCorrenteId,
      userId
    );
    if (!proprietario) {
      return "Accesso negato: l'utente non è autorizzato a visualizzare i movimenti di questo conto.";
    }

    const { ObjectId } = require("mongodb");
    return MovimentoModel.find({
      contoCorrenteId: new ObjectId(contoCorrenteId),
      categoriaMovimentoID: new ObjectId(categoriaID),
    })
      .sort({ data: -1 })
      .limit(n);
  }

  // Recupera movimenti tra date
  async getMovimentiTraDate(
    contoCorrenteId: string,
    dataInizio: Date,
    dataFine: Date,
    n: number,
    userId: string
  ): Promise<MovimentoContoCorrente[] | string> {
    // Verifica che l'utente abbia accesso al conto
    const proprietario = await this.verificaProprietarioConto(
      contoCorrenteId,
      userId
    );
    if (!proprietario) {
      return "Accesso negato: l'utente non è autorizzato a visualizzare i movimenti di questo conto.";
    }

    const { ObjectId } = require("mongodb");
    return MovimentoModel.find({
      contoCorrenteId: new ObjectId(contoCorrenteId),
      data: {
        $gte: new Date(dataInizio), // Maggiore o uguale a dataInizio
        $lte: new Date(dataFine), // Minore o uguale a dataFine
      },
    })
      .sort({ data: -1 })
      .limit(n);
  }

  // Funzione per ottenere l'ultimo movimento di un conto corrente
  async getUltimoMovimento(contoCorrenteId: string) {
    try {
      const { ObjectId } = require("mongodb");
      // Verifica che il contoCorrenteId sia un ObjectId valido
      const objectId = new ObjectId(contoCorrenteId);

      // Cerca l'ultimo movimento ordinato per data (dal più recente al meno recente)
      const ultimoMovimento = await MovimentoModel.findOne({
        contoCorrenteId: objectId,
      })
        .sort({ data: -1 }) // Ordina per data in ordine decrescente (il più recente)
        .exec(); // Esegui la query

      return ultimoMovimento; // Restituisce l'ultimo movimento, oppure null se non esiste
    } catch (error) {
      throw new Error(
        `Errore durante il recupero dell'ultimo movimento: ${error}`
      );
    }
  }

  // Creazione di un nuovo movimento, usando DTO per validare l'input
  async createMovimento(
    movimentoDTO: MovimentoContoCorrenteDTO,
    contoCorrenteId: string,
    userId: string
  ): Promise<MovimentoContoCorrente | string[]> {
    // Verifica che l'utente abbia accesso al conto
    const proprietario = await this.verificaProprietarioConto(
      contoCorrenteId,
      userId
    );
    if (!proprietario) {
      return [
        "Accesso negato: l'utente non è autorizzato a visualizzare i movimenti di questo conto.",
      ];
    }

    // Validazione del DTO
    const validationErrors = await validate(movimentoDTO);
    if (validationErrors.length > 0) {
      return validationErrors.map((err) =>
        Object.values(err.constraints || {}).join(", ")
      );
    }

    // Creazione dell'istanza da salvare nel DB usando l'entity
    const movimento = new MovimentoModel(movimentoDTO);
    return await movimento.save();
  }

    // Recupera movimenti per conto corrente
    async getMovimentiById(
      contoCorrenteId: string,
      userId: string,
      movimentoId: string
    ): Promise<MovimentoContoCorrente | string | null> {
      try {
        // Verifica che l'utente abbia accesso al conto
        const proprietario = await this.verificaProprietarioConto(
          contoCorrenteId,
          userId
        );
        if (!proprietario) {
          return "Accesso negato: l'utente non è autorizzato a visualizzare i movimenti di questo conto.";
        }
    
        const { ObjectId } = require("mongodb"); // Importa ObjectId
    
        // Converto la stringa in ObjectId
        const objectIdContoCorrente = new ObjectId(contoCorrenteId);
    
        return await MovimentoModel.findOne({
          _id: movimentoId,
          contoCorrenteId: objectIdContoCorrente  // Aggiungi questa condizione
        });
    }catch(error){
      return `Errore durante il recupero del movimento: ${error}`; 
    }
  }
}

export default new MovimentiService();
