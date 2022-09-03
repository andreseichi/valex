import { compareSync } from "bcrypt";
import { findById } from "../repositories/businessRepository";
import { findByCardDetails } from "../repositories/cardRepository";
import { insert } from "../repositories/paymentRepository";
import { checkExpirationDate } from "../utils/checkExpirationDate";
import { getCardholderName } from "../utils/getCardholderName";
import { getCardBalanceService } from "./cardService";

import { PaymentInsertData } from "../types/payment";

export async function purchaseCardService(
  cardNumber: string,
  fullName: string,
  expirationDate: string,
  password: number,
  businessId: number,
  amount: number
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

  if (!cardDB.password) {
    throw {
      type: "card_not_activated",
      message: "Card not activated. You need to activate the card to purchase",
    };
  }

  const expirationDateDB = cardDB.expirationDate;
  const diff = checkExpirationDate(expirationDateDB);
  if (diff < 0) {
    throw { type: "card_expired", message: "Card is expired" };
  }

  if (cardDB.isBlocked) {
    throw {
      type: "card_blocked",
      message: "Card blocked. You need to unblock the card",
    };
  }

  const passwordDB = cardDB.password;
  if (!compareSync(password.toString(), passwordDB)) {
    throw {
      type: "password_not_match",
      message: "Password is incorrect",
    };
  }

  const business = await findById(businessId);
  if (!business) {
    throw {
      type: "business_not_found",
      message: "Business not found or not registered",
    };
  }

  if (cardDB.type !== business.type) {
    throw {
      type: "invalid_card_type",
      message: "Card type is not valid for this business",
    };
  }

  const { balance } = await getCardBalanceService(
    cardNumber,
    fullName,
    expirationDate
  );

  if (balance < amount) {
    throw {
      type: "insufficient_balance",
      message: "Insufficient balance",
    };
  }

  const paymentData: PaymentInsertData = {
    cardId: cardDB.id,
    amount,
    businessId,
  };

  await insert(paymentData);

  return {
    type: "success",
    message: `Purchase successful. You have spent $${amount} at ${business.name}`,
  };
}
