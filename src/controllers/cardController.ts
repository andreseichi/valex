import { Request, Response } from "express";

import {
  activateCardService,
  blockCardService,
  createCardService,
} from "../services/cardService";
import { TransactionTypes } from "../types/card";

export async function createCard(req: Request, res: Response) {
  try {
    const apiKey: string = res.locals.headers["x-api-key"];
    const employeeId: number = res.locals.body.employeeId;
    const cardType: TransactionTypes = res.locals.body.type;

    const result = await createCardService(apiKey, employeeId, cardType);

    console.log(result);
    return res.send({ result });
  } catch (error) {
    console.log(error);

    // TODO tratar o erro
  }
}

export async function activateCard(req: Request, res: Response) {
  try {
    const { id, CVC, password }: { id: number; CVC: string; password: number } =
      res.locals.body;

    const result = await activateCardService(id, CVC, password);

    return res.send({ result });
  } catch (error) {
    console.log(error);

    // TODO tratar o erro
  }
}

export async function blockCard(req: Request, res: Response) {
  try {
    const {
      number,
      cardholderName,
      expirationDate,
      password,
    }: {
      number: string;
      cardholderName: string;
      expirationDate: string;
      password: number;
    } = res.locals.body;

    const result = await blockCardService(
      number,
      cardholderName,
      expirationDate,
      password
    );

    return res.send({ result });
  } catch (error) {
    console.log(error);

    // TODO tratar o erro
  }
}
