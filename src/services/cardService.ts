import {
  findByTypeAndEmployeeId,
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

    console.log(employeeActive);
  } catch (error) {
    return error;
  }
}
