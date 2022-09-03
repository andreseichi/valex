import { Request, Response } from "express";
import { purchaseCardService } from "../services/purchaseService";

export async function purchase(req: Request, res: Response) {
  const {
    number,
    cardholderName,
    expirationDate,
    password,
    businessId,
    amount,
  }: {
    number: string;
    cardholderName: string;
    expirationDate: string;
    password: number;
    businessId: number;
    amount: number;
  } = res.locals.body;

  const result = await purchaseCardService(
    number,
    cardholderName,
    expirationDate,
    password,
    businessId,
    amount
  );

  return res.send({ result });
}
