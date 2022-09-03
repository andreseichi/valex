import { Request, Response } from "express";

import {
  activateCardService,
  blockCardService,
  createCardService,
  getCardBalanceService,
  unblockCardService,
} from "../services/cardService";
import { TransactionTypes } from "../types/card";

export async function createCard(req: Request, res: Response) {
  const apiKey: string = res.locals.headers["x-api-key"];
  const employeeId: number = res.locals.body.employeeId;
  const cardType: TransactionTypes = res.locals.body.type;

  const result = await createCardService(apiKey, employeeId, cardType);

  return res.send({ result });
}

export async function getCardBalance(req: Request, res: Response) {
  const {
    number,
    fullName,
    expirationDate,
  }: {
    number: string;
    fullName: string;
    expirationDate: string;
  } = res.locals.body;

  const result = await getCardBalanceService(number, fullName, expirationDate);

  return res.send({ result });
}

export async function activateCard(req: Request, res: Response) {
  const {
    number,
    fullName,
    expirationDate,
    password,
    CVC,
  }: {
    number: string;
    fullName: string;
    expirationDate: string;
    password: number;
    CVC: string;
  } = res.locals.body;

  const result = await activateCardService(
    number,
    fullName,
    expirationDate,
    password,
    CVC
  );

  return res.send({ result });
}

export async function blockCard(req: Request, res: Response) {
  const {
    number,
    fullName,
    expirationDate,
    password,
  }: {
    number: string;
    fullName: string;
    expirationDate: string;
    password: number;
  } = res.locals.body;

  const result = await blockCardService(
    number,
    fullName,
    expirationDate,
    password
  );

  return res.send({ result });
}

export async function unblockCard(req: Request, res: Response) {
  const {
    number,
    fullName,
    expirationDate,
    password,
  }: {
    number: string;
    fullName: string;
    expirationDate: string;
    password: number;
  } = res.locals.body;

  const result = await unblockCardService(
    number,
    fullName,
    expirationDate,
    password
  );

  return res.send({ result });
}
