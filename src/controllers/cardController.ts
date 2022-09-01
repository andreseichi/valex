import { Request, Response } from "express";

import { createCardService } from "../services/cardService";
import { TransactionTypes } from "../repositories/cardRepository";

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
  }
}
