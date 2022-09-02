import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dayjs from "dayjs";

import { CardInsertData as Card, TransactionTypes } from "../types/card";
import { getCardholderName } from "./getCardholderName";

import dotenv from "dotenv";
import { Employee } from "../types/employee";
dotenv.config();

export function createCard(
  employeeId: number,
  employee: Employee,
  type: TransactionTypes
) {
  const cardNumber = faker.finance.creditCardNumber("####-####-####-####");

  const employeeFullName = employee.fullName;
  const cardholderName = getCardholderName(employeeFullName);

  const expirationDate = dayjs().add(5, "y").format("MM/YY");

  const securityCode = faker.finance.creditCardCVV();

  const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
  const securityCodeEncrypted = cryptr.encrypt(securityCode);

  const card: Card = {
    employeeId,
    number: cardNumber,
    cardholderName,
    securityCode: securityCodeEncrypted,
    expirationDate,
    isVirtual: false,
    isBlocked: false,
    type,
  };

  return card;
}
