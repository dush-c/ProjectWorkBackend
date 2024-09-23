import { NextFunction, Response, Request } from "express";
import { ContoCorrente } from "./controCorrente.entity";
import contoService from "./contoCorrente.service";
import bigInt from "big-integer";
import contoCorrenteService from "./contoCorrente.service";

export const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, cognome, nome } = req.body;

    // const newConto: ContoCorrente = {
    //   email: email,
    //   password: password,
    //   cognomeTitolare: cognome,
    //   nomeTitolare: nome,
    //   dataApertura: new Date(),
    //   IBAN: generateIBAN(),
    // };

    // const user = req.user!;

    // const saved = await contoService.add(user, newConto);

    // res.json(saved);
    // res.status(201);
  } catch (err) {
    next(err);
  }
};

export const info = async (req: Request, res: Response, next: NextFunction) => {
  //return every information inside the bankaccounts 'table'
  const user = req.user!;

  const bankAccountInfo = await contoCorrenteService.info(user);

  res.json(bankAccountInfo);
  res.status(201);
}


/*
    id?: string;
    email: string;
    password: string;
    cognomeTitolare: string;
    nomeTitolare: string;
    dataApertura: Date;
    IBAN: string;
} */
