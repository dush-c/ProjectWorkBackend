import { NextFunction, Response, Request } from "express";
import { ContoCorrente } from "./controCorrente.entity";
import contoService from "./contoCorrente.service";
import bigInt from "big-integer";

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


/*
    id?: string;
    email: string;
    password: string;
    cognomeTitolare: string;
    nomeTitolare: string;
    dataApertura: Date;
    IBAN: string;
} */
