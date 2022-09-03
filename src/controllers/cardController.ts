import { Request, Response } from "express";

import {
  activateCardService,
  blockCardService,
  createCardService,
} from "../services/cardService";
import { TransactionTypes } from "../types/card";

export async function createCard(req: Request, res: Response) {
  const apiKey: string = res.locals.headers["x-api-key"];
  const employeeId: number = res.locals.body.employeeId;
  const cardType: TransactionTypes = res.locals.body.type;

  const result = await createCardService(apiKey, employeeId, cardType);

  return res.send({ result });
}

export async function activateCard(req: Request, res: Response) {
  const { id, CVC, password }: { id: number; CVC: string; password: number } =
    res.locals.body;

  const result = await activateCardService(id, CVC, password);

  return res.send({ result });
}

export async function blockCard(req: Request, res: Response) {
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
}
