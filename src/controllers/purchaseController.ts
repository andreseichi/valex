import { Request, Response } from "express";
import { purchaseCardService } from "../services/purchaseService";

export async function purchase(req: Request, res: Response) {
  const {
    number,
    fullName,
    expirationDate,
    password,
    businessId,
    amount,
  }: {
    number: string;
    fullName: string;
    expirationDate: string;
    password: string;
    businessId: number;
    amount: number;
  } = res.locals.body;

  const result = await purchaseCardService(
    number,
    fullName,
    expirationDate,
    password,
    businessId,
    amount
  );

  return res.send({ result });
}
