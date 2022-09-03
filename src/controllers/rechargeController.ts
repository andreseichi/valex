import { Request, Response } from "express";

import { rechargeCardService } from "../services/rechargeService";

export async function rechargeCard(req: Request, res: Response) {
  const apiKey: string = res.locals.headers["x-api-key"];
  const {
    number,
    cardholderName,
    expirationDate,
    amount,
  }: {
    number: string;
    cardholderName: string;
    expirationDate: string;
    amount: number;
  } = res.locals.body;

  const result = await rechargeCardService(
    apiKey,
    number,
    cardholderName,
    expirationDate,
    amount
  );
  console.log(result);

  return res.send({ result });
}
