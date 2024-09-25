
async function AperturaConto(user) {
    
    const contoId = (user.contoCorrenteId).toString();
    console.log("conto id",contoId);

    const aperturaConto = {
      categoriaMovimentoID: "66f180ef3af4b7f8c8ca9184",
      contoCorrenteId: contoId,
      data: new Date(),
      importo: 0,
      saldo: 0,
      descrizioneEstesa: "Apertura Conto"
    }

    console.log("Apertura conto",aperturaConto);
    
    return await MovimentoModel.create(aperturaConto);
}

  var user = {
    firstName: 'Giovanni',
    lastName: 'Meneghello',
    username: 'giovanni.meneghello@itsdigitalacademy.com',
    picture: 'https://picsum.photos',
    contoCorrenteId: new ObjectId("66f3c62a1eb51f05b6bcd9f9"),
    isConfirmed: true,
    id: '66f3c62a1eb51f05b6bcd9f4'
  }

  var conto = AperturaConto(user);