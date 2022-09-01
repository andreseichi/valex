import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";

import dotenv from "dotenv";
dotenv.config();

import {
  CardInsertData,
  findByTypeAndEmployeeId,
  insert,
  TransactionTypes,
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
