import { forEach } from "lodash";
import { ContoCorrenteModel } from "./api/contoCorrente/contoCorrente.model";
import generateIBAN from "./api/services/functions/generateIBAN.function";
import {User} from "./api/user/user.model";

const mongoose = require('mongoose');

// Connessione a MongoDB
mongoose.connect('mongodb+srv://giovannimeneghello:L2OefCiUbJ7xXaKk@clusteprimo.vdi3tck.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// Schema per CategoriaMovimenti
const CategoriaMovimentiSchema = new mongoose.Schema({
  NomeCategoria: String,
  Tipologia: String
});

const CategoriaMovimenti = mongoose.model('CategoriaMovimenti', CategoriaMovimentiSchema);

// Schema per Movimenti Conto Corrente
const MovimentiContoCorrenteSchema = new mongoose.Schema({
  contoCorrenteID: mongoose.Schema.Types.ObjectId,
  data: Date,
  importo: Number,
  saldo: Number,
  categoriaMovimentoID: mongoose.Schema.Types.ObjectId,
  descrizioneEstesa: String
});

const MovimentiContoCorrente = mongoose.model('MovimentiContoCorrente', MovimentiContoCorrenteSchema);

// Funzione principale per popolare il database
export async function populateDatabase() {
  try {
    // 1. Inserisci le categorie dei movimenti
    const categorieMovimenti = [
      { NomeCategoria: 'Apertura Conto', Tipologia: 'Entrata' },
      { NomeCategoria: 'Bonifico Entrata', Tipologia: 'Entrata' },
      { NomeCategoria: 'Bonifico Uscita', Tipologia: 'Uscita' },
      { NomeCategoria: 'Prelievo contanti', Tipologia: 'Uscita' },
      { NomeCategoria: 'Pagamento Utenze', Tipologia: 'Uscita' },
      { NomeCategoria: 'Ricarica', Tipologia: 'Entrata' },
      { NomeCategoria: 'Versamento Bancomat', Tipologia: 'Entrata' }
    ];

    //const categorieInserite = await CategoriaMovimenti.insertMany(categorieMovimenti);
    const categorieInserite = await CategoriaMovimenti.find({});

    //console.log('Categorie inserite:', categorieInserite);


    // 2. Crea gli utenti await User.insertMany
    const utenti = ([
    {
        firstName: 'Mario',
        lastName: 'Rossi',
        username: 'mario.rossi',
        picture: 'https://example.com/mario.jpg',
        password: 'Password1234'
    },
    {
        firstName: 'Luigi',
        lastName: 'Bianchi',
        username: 'luigi.bianchi',
        picture: 'https://example.com/luigi.jpg',
        password: 'Password1234'
    }
    ]);

    console.log('Utenti creati:', utenti);
    const utentiInseriti = await User.find({});

    const contiCorrentiInseriti = await ContoCorrenteModel.find({});

    // 2. Inserisci i conti correnti
    const contiCorrenti = [
      {
        username: 'utente1@gmail.com',
        password: 'password123',
        cognomeTitolare: 'Rossi',
        nomeTitolare: 'Mario',
        dataApertura: new Date('2023-01-01'),
        IBAN: generateIBAN()
      },
      {
        username: 'utente2@gmail.com',
        password: 'password456',
        cognomeTitolare: 'Bianchi',
        nomeTitolare: 'Luigi',
        dataApertura: new Date('2023-02-01'),
        IBAN: generateIBAN()
      }
    ];

    // const contiInseriti = await ContoCorrenteModel.insertMany(contiCorrenti);
    // console.log('Conti correnti inseriti:', contiInseriti);

    // 3. Inserisci i movimenti per ciascun conto corrente
    const movimentiConto1 = [
      { importo: 1000, descrizioneEstesa: 'Apertura Conto', categoria: 'Apertura Conto' },
      { importo: 500, descrizioneEstesa: 'Bonifico disposto da...', categoria: 'Bonifico Entrata' },
      { importo: -200, descrizioneEstesa: 'Pagamento utenza luce', categoria: 'Pagamento Utenze' },
      { importo: 300, descrizioneEstesa: 'Bonifico disposto da...', categoria: 'Bonifico Entrata' },
      { importo: -150, descrizioneEstesa: 'Prelievo contanti', categoria: 'Prelievo contanti' },
      { importo: 100, descrizioneEstesa: 'Versamento Bancomat', categoria: 'Versamento Bancomat' },
    ];

    const movimentiConto2 = [
      { importo: 1200, descrizioneEstesa: 'Apertura Conto', categoria: 'Apertura Conto' },
      { importo: 400, descrizioneEstesa: 'Bonifico disposto da...', categoria: 'Bonifico Entrata' },
      { importo: -100, descrizioneEstesa: 'Pagamento utenza gas', categoria: 'Pagamento Utenze' },
      { importo: -50, descrizioneEstesa: 'Prelievo contanti', categoria: 'Prelievo contanti' },
      { importo: 250, descrizioneEstesa: 'Ricarica effettuata', categoria: 'Ricarica' },
    ];

    // Funzione per inserire i movimenti con il saldo aggiornato
    async function inserisciMovimenti(contoCorrenteID, movimenti) {
      let saldo = 0;
      for (let movimento of movimenti) {
        const categoriaMovimento = categorieInserite.find(cat => cat.NomeCategoria === movimento.categoria);
        saldo += movimento.importo;
        await MovimentiContoCorrente.create({
          contoCorrenteID,
          data: new Date(),
          importo: movimento.importo,
          saldo,
          categoriaMovimentoID: categoriaMovimento._id,
          descrizioneEstesa: movimento.descrizioneEstesa
        });
      }
    }

    utentiInseriti.forEach(utente =>{
      if(utente.username == "utente1@gmail.com"){
        const contoCorrente = contiCorrentiInseriti.find(cat => cat._id === utente.contoCorrenteId);
        console.log(contoCorrente);
        if (contoCorrente)
          inserisciMovimenti(contoCorrente._id, movimentiConto1);
      }
      if(utente.username == "utente2@gmail.com"){
        const contoCorrente = contiCorrentiInseriti.find(cat => cat._id === utente.contoCorrenteId);
        console.log(contoCorrente);
        if (contoCorrente)
          inserisciMovimenti(contoCorrente._id, movimentiConto2);
      }
    })
    await inserisciMovimenti("66f13d9ecdef0a385af32afd", movimentiConto1);

    // const contoCorrente1 = contiCorrentiInseriti.find(cat => cat._id === utentiInseriti[0].contocorrenteId);
    // const contoCorrente2 = contiCorrentiInseriti.find(cat => cat.username === utenti[0].username);


    // console.log("Conte corrente 1: ", contoCorrente1);
    // console.log("Conte corrente 2: ", contoCorrente2);

    // Inserisci i movimenti per i due conti correnti
    // if (contoCorrente1 && contoCorrente2){
    //   await inserisciMovimenti(contoCorrente1._id, movimentiConto1);
    //   await inserisciMovimenti(contoCorrente2._id, movimentiConto2);
    // }

    console.log('Movimenti inseriti con successo');
  } catch (error) {
    console.error('Errore durante il popolamento del database:', error);
  } finally {
    mongoose.connection.close();
  }
}
