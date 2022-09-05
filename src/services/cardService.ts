import { hashSync } from "bcrypt";
import Cryptr from "cryptr";

import { insert, update } from "../repositories/cardRepository";
import { findByCardId } from "../repositories/paymentRepository";
import { findByCardId as findReachargesByCardId } from "../repositories/rechargeRepository";
import { CardUpdateData, TransactionTypes } from "../types/card";
import { createCard } from "../utils/createCard";
import {
  cardIsActivated,
  cardTypeRegistered,
  checkCardBlockStatus,
  checkCardIsExpired,
  checkCardRegistered,
  checkEmployeeRegistered,
  checkPasswordIsCorrect,
  checkValidApiKey,
  cvcIsValid,
  passwordIsValid,
} from "./validationsService";

export async function createCardService(
  apiKey: string,
  employeeId: number,
  cardType: TransactionTypes
) {
  await checkValidApiKey(apiKey);
  const employeeActive = await checkEmployeeRegistered(employeeId);

  await cardTypeRegistered(cardType, employeeId);

  const cardData = createCard(employeeId, employeeActive, cardType);
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
  const originalCVC = cryptr.decrypt(cardData.securityCode);

  await insert(cardData);

  return {
    card: { ...cardData, securityCode: originalCVC },
  };
}

export async function getCardBalanceService(
  cardNumber: string,
  fullName: string,
  expirationDate: string
) {
  const cardDB = await checkCardRegistered(
    fullName,
    cardNumber,
    expirationDate
  );

  const transactions = await findByCardId(cardDB.id);
  const recharges = await findReachargesByCardId(cardDB.id);

  const balance =
    recharges.reduce((acc, current) => acc + current.amount, 0) -
    transactions.reduce((acc, current) => acc + current.amount, 0);

  return {
    balance,
    transactions,
    recharges,
  };
}

export async function activateCardService(
  cardNumber: string,
  fullName: string,
  expirationDate: string,
  password: string,
  CVC: string
) {
  const cardDB = await checkCardRegistered(
    fullName,
    cardNumber,
    expirationDate
  );

  await checkCardIsExpired(cardDB);
  await cardIsActivated(cardDB);
  await cvcIsValid(cardDB, CVC);
  await passwordIsValid(password);

  const passwordEncrypted = hashSync(password.toString(), 10);

  const cardData: CardUpdateData = {
    password: passwordEncrypted,
  };

  await update(cardDB.id, cardData);

  return {
    type: "success",
    message: "Card activated",
  };
}

export async function blockCardService(
  cardNumber: string,
  fullName: string,
  expirationDate: string,
  password: string
) {
  const cardDB = await checkCardRegistered(
    fullName,
    cardNumber,
    expirationDate
  );

  await checkCardIsExpired(cardDB);
  await checkPasswordIsCorrect(cardDB, password);
  await checkCardBlockStatus(cardDB, "isBlocked");

  const cardData: CardUpdateData = {
    isBlocked: true,
  };

  await update(cardDB.id, cardData);

  return {
    type: "success",
    message: "Card blocked",
  };
}

export async function unblockCardService(
  cardNumber: string,
  fullName: string,
  expirationDate: string,
  password: string
) {
  const cardDB = await checkCardRegistered(
    fullName,
    cardNumber,
    expirationDate
  );

  await checkCardIsExpired(cardDB);
  await checkPasswordIsCorrect(cardDB, password);
  await checkCardBlockStatus(cardDB, "isUnblocked");

  const cardData: CardUpdateData = {
    isBlocked: false,
  };

  await update(cardDB.id, cardData);

  return {
    type: "success",
    message: "Card unblocked",
  };
}
