import Cryptr from "cryptr";
import { hashSync, compareSync } from "bcrypt";

import dotenv from "dotenv";
dotenv.config();

import {
  findByCardDetails,
  findById as findCardById,
  findByTypeAndEmployeeId,
  insert,
  update,
} from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";
import { getCardholderName } from "../utils/getCardholderName";
import { checkExpirationDate } from "../utils/checkExpirationDate";
import { CardUpdateData, TransactionTypes } from "../types/card";
import { createCard } from "../utils/createCard";
import { findByCardId } from "../repositories/paymentRepository";
import { findByCardId as findReachargesByCardId } from "../repositories/rechargeRepository";

export async function createCardService(
  apiKey: string,
  employeeId: number,
  cardType: TransactionTypes
) {
  const company = await findByApiKey(apiKey);
  if (!company) {
    throw { type: "invalid_api_key", message: "Invalid API key" };
  }

  const employeeActive = await findById(employeeId);
  if (!employeeActive) {
    throw { type: "invalid_employee_id", message: "Invalid employee id" };
  }

  const employeeCardType = await findByTypeAndEmployeeId(cardType, employeeId);
  if (employeeCardType) {
    throw { type: "card_already_exists", message: "Card already exists" };
  }

  const cardData = createCard(employeeId, employeeActive, cardType);

  await insert(cardData);
  return {
    type: "success",
    message: "New card created. You need to create a password to active it",
  };
}

export async function getCardBalanceService(
  cardNumber: string,
  fullName: string,
  expirationDate: string
) {
  const cardholderName = getCardholderName(fullName);
  const cardDB = await findByCardDetails(
    cardNumber,
    cardholderName,
    expirationDate
  );
  if (!cardDB) {
    throw {
      type: "invalid_card",
      message: "Invalid card or card is not registered",
    };
  }

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
  password: number,
  CVC: string
) {
  const cardholderName = getCardholderName(fullName);
  const cardDB = await findByCardDetails(
    cardNumber,
    cardholderName,
    expirationDate
  );

  if (!cardDB) {
    throw {
      type: "invalid_card",
      message: "Invalid card or card is not registered",
    };
  }

  const expirationDateDB = cardDB.expirationDate;
  const diff = checkExpirationDate(expirationDateDB);
  if (diff < 0) {
    throw { type: "card_expired", message: "Card is expired" };
  }

  if (cardDB.password) {
    throw {
      type: "card_already_activated",
      message: "Card already activated",
    };
  }

  const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
  const securityCodeDecrypted = cryptr.decrypt(cardDB.securityCode);

  if (CVC !== securityCodeDecrypted) {
    throw {
      type: "invalid_cvc",
      message: "Invalid CVC",
    };
  }

  if (password.toString().length !== 4) {
    throw {
      type: "invalid_password",
      message: "Invalid password. Password should be 4 digits",
    };
  }

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
  password: number
) {
  const cardholderName = getCardholderName(fullName);
  const cardDB = await findByCardDetails(
    cardNumber,
    cardholderName,
    expirationDate
  );
  if (!cardDB) {
    throw {
      type: "invalid_card",
      message: "Invalid card or card is not registered",
    };
  }

  const expirationDateDB = cardDB.expirationDate;
  const diff = checkExpirationDate(expirationDateDB);

  if (diff < 0) {
    throw { type: "card_expired", message: "Card is expired" };
  }

  const passwordDB = cardDB.password;
  if (!compareSync(password.toString(), passwordDB)) {
    throw {
      type: "password_not_match",
      message: "Password is incorrect",
    };
  }

  const isCardDBBlocked = cardDB.isBlocked;
  if (isCardDBBlocked) {
    throw {
      type: "card_already_blocked",
      message: "Card already blocked",
    };
  }

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
  password: number
) {
  const cardholderName = getCardholderName(fullName);
  const cardDB = await findByCardDetails(
    cardNumber,
    cardholderName,
    expirationDate
  );
  if (!cardDB) {
    throw {
      type: "invalid_card",
      message: "Invalid card or card is not registered",
    };
  }

  const expirationDateDB = cardDB.expirationDate;
  const diff = checkExpirationDate(expirationDateDB);

  if (diff < 0) {
    throw { type: "card_expired", message: "Card is expired" };
  }

  const passwordDB = cardDB.password;
  if (!compareSync(password.toString(), passwordDB)) {
    throw {
      type: "password_not_match",
      message: "Password is incorrect",
    };
  }

  const isCardDBBlocked = cardDB.isBlocked;
  if (!isCardDBBlocked) {
    throw {
      type: "card_already_unblocked",
      message: "Card already unblocked",
    };
  }

  const cardData: CardUpdateData = {
    isBlocked: false,
  };

  await update(cardDB.id, cardData);

  return {
    type: "success",
    message: "Card unblocked",
  };
}
