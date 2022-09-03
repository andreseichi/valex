import { compareSync } from "bcrypt";
import Cryptr from "cryptr";
import dotenv from "dotenv";
dotenv.config();

import {
  findByCardDetails,
  findByTypeAndEmployeeId,
} from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";
import { checkExpirationDate } from "../utils/checkExpirationDate";
import { getCardholderName } from "../utils/getCardholderName";
import { Card, TransactionTypes } from "../types/card";

export async function checkValidApiKey(apiKey: string) {
  const company = await findByApiKey(apiKey);
  if (!company) {
    throw { type: "invalid_api_key", message: "Invalid API key" };
  }
}

export async function cardTypeRegistered(
  cardType: TransactionTypes,
  employeeId: number
) {
  const employeeCardType = await findByTypeAndEmployeeId(cardType, employeeId);
  if (employeeCardType) {
    throw { type: "card_already_exists", message: "Card already exists" };
  }
}

export async function cardIsActivated(card: Card) {
  if (card.password) {
    throw {
      type: "card_already_activated",
      message: "Card already activated",
    };
  }
}

export async function cvcIsValid(card: Card, CVC: string) {
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
  const securityCodeDecrypted = cryptr.decrypt(card.securityCode);

  if (CVC !== securityCodeDecrypted) {
    throw {
      type: "invalid_cvc",
      message: "Invalid CVC",
    };
  }
}

export async function passwordIsValid(password: number) {
  if (password.toString().length !== 4) {
    throw {
      type: "invalid_password",
      message: "Invalid password. Password should be 4 digits",
    };
  }
}

export async function checkEmployeeRegistered(employeeId: number) {
  const employeeActive = await findById(employeeId);
  if (!employeeActive) {
    throw { type: "invalid_employee_id", message: "Invalid employee id" };
  }

  return employeeActive;
}

export async function checkCardRegistered(
  fullName: string,
  cardNumber: string,
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

  return cardDB;
}

export async function checkCardIsExpired(card: Card) {
  const expirationDateDB = card.expirationDate;
  const diff = checkExpirationDate(expirationDateDB);
  if (diff < 0) {
    throw { type: "card_expired", message: "Card is expired" };
  }
}

export async function checkPasswordIsCorrect(card: Card, password: string) {
  const passwordDB = card.password;
  if (!compareSync(password.toString(), passwordDB)) {
    throw {
      type: "password_not_match",
      message: "Password is incorrect",
    };
  }
}

export async function checkCardBlockStatus(
  card: Card,
  checkStatus: "isBlocked" | "isUnblocked"
) {
  const isCardDBBlocked = card.isBlocked;

  if (checkStatus === "isBlocked" && isCardDBBlocked) {
    throw {
      type: "card_already_blocked",
      message: "Card already blocked",
    };
  } else if (checkStatus === "isUnblocked" && !isCardDBBlocked) {
    throw {
      type: "card_already_unblocked",
      message: "Card already unblocked",
    };
  }
}
