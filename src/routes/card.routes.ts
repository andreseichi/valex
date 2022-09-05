import { Router } from "express";
import {
  activateCard,
  blockCard,
  createCard,
  getCardBalance,
  unblockCard,
} from "../controllers/cardController";
import {
  validateHeaderSchema,
  validateSchema,
} from "../middlewares/schemaMiddleware";
import { apiKeySchema } from "../schemas/apiKeySchema";
import {
  activateCardSchema,
  balanceCardSchema,
  validateCardSchema,
  createCardSchema,
} from "../schemas/cardSchema";

const cardRouter = Router();

cardRouter.post(
  "/card/create",
  validateHeaderSchema(apiKeySchema),
  validateSchema(createCardSchema),
  createCard
);

cardRouter.post(
  "/card/balance",
  validateSchema(balanceCardSchema),
  getCardBalance
);

cardRouter.put(
  "/card/activate",
  validateSchema(activateCardSchema),
  activateCard
);

cardRouter.put("/card/block", validateSchema(validateCardSchema), blockCard);

cardRouter.put(
  "/card/unblock",
  validateSchema(validateCardSchema),
  unblockCard
);

export { cardRouter };
