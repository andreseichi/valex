import { findByApiKey } from "../repositories/companyRepository";
import { findByCardDetails } from "../repositories/cardRepository";
import { getCardholderName } from "../utils/getCardholderName";
import { checkExpirationDate } from "../utils/checkExpirationDate";
import { insert } from "../repositories/rechargeRepository";

export async function rechargeCardService(
  apiKey: string,
  cardNumber: string,
  fullName: string,
  expirationDate: string,
  amount: number
) {
  const company = await findByApiKey(apiKey);
  if (!company) {
    throw { type: "invalid_api_key", message: "Invalid API key" };
  }

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
      message: "Card not activated. You need to activate the card",
    };
  }

  if (cardDB.isBlocked) {
    throw {
      type: "card_blocked",
      message: "Card blocked. You need to unblock the card",
    };
  }

  const expirationDateDB = cardDB.expirationDate;
  const diff = checkExpirationDate(expirationDateDB);
  if (diff < 0) {
    throw { type: "card_expired", message: "Card is expired" };
  }

  const rechargeData = {
    cardId: cardDB.id,
    amount,
  };

  await insert(rechargeData);

  return {
    type: "success",
    message: `Card recharged with $${amount}`,
  };
}
