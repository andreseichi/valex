import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import { hashSync, compareSync } from "bcrypt";

import dotenv from "dotenv";
dotenv.config();

import {
  CardInsertData,
  CardUpdateData,
  findById as findCardById,
  findByTypeAndEmployeeId,
  insert,
  TransactionTypes,
  update,
} from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";

export async function createCardService(
  apiKey: string,
  employeeId: number,
  cardType: TransactionTypes
) {
  try {
    const company = await findByApiKey(apiKey);
    if (!company) {
      throw { type: "invalid_api_key", message: "Invalid API key" };
    }

    const employeeActive = await findById(employeeId);
    if (!employeeActive) {
      throw { type: "invalid_employee_id", message: "Invalid employee id" };
    }

    const employeeCardType = await findByTypeAndEmployeeId(
      cardType,
      employeeId
    );
    if (employeeCardType) {
      throw { type: "card_already_exists", message: "Card already exists" };
    }

    const cardNumber = faker.finance.creditCardNumber("####-####-####-####");

    const employeeFullName = employeeActive.fullName;
    const employeeFullNameFiltered = employeeFullName
      .split(" ")
      .filter((name) => name.length >= 3);
    const firstName = employeeFullNameFiltered[0];
    const lastName =
      employeeFullNameFiltered[employeeFullNameFiltered.length - 1];
    const cardholderName = `${firstName} ${employeeFullNameFiltered
      .slice(1, employeeFullNameFiltered.length - 1)
      .map((name) => name[0])
      .join(" ")} ${lastName}`.toUpperCase();

    const expirationDate = dayjs().add(5, "y").format("MM/YY");

    const securityCode = faker.finance.creditCardCVV();

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const securityCodeEncrypted = cryptr.encrypt(securityCode);

    const cardData: CardInsertData = {
      employeeId,
      number: cardNumber,
      cardholderName,
      securityCode: securityCodeEncrypted,
      expirationDate,
      isVirtual: false,
      isBlocked: true,
      type: cardType,
    };

    await insert(cardData);
    return {
      type: "success",
      message: "New card created. You need to create a password to active it",
    };
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function activateCardService(
  cardId: number,
  CVC: string,
  password: number
) {
  try {
    const cardDB = await findCardById(cardId);
    if (!cardDB) {
      throw { type: "invalid_card_id", message: "Card is not registered" };
    }

    const expirationDate = cardDB.expirationDate;
    const today = dayjs().format("MM/YY");

    const dateExpirationDate = dayjs(expirationDate);
    const dateToday = dayjs(today);
    const diff = dateExpirationDate.diff(dateToday);

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
        message: "Invalid password",
      };
    }

    const passwordEncrypted = hashSync(password.toString(), 10);

    const cardData: CardUpdateData = {
      password: passwordEncrypted,
    };

    await update(cardId, cardData);

    return {
      type: "success",
      message: "Card activated",
    };
  } catch (error) {
    console.log(error);

    return error;
  }
}
