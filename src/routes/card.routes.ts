import { Router } from "express";
import {
  activateCard,
  blockCard,
  createCard,
  unblockCard,
} from "../controllers/cardController";
import {
  validateHeaderSchema,
  validateSchema,
} from "../middlewares/schemaMiddleware";
import {
  activateCardSchema,
  apiKeySchema,
  blockUnblockCardSchema,
  createCardSchema,
} from "../schemas/cardSchema";

const cardRouter = Router();

cardRouter.post(
  "/card",
  validateHeaderSchema(apiKeySchema),
  validateSchema(createCardSchema),
  createCard
);

cardRouter.put(
  "/card/activate",
  validateSchema(activateCardSchema),
  activateCard
);

cardRouter.put(
  "/card/block",
  validateSchema(blockUnblockCardSchema),
  blockCard
);

cardRouter.put(
  "/card/unblock",
  validateSchema(blockUnblockCardSchema),
  unblockCard
);

export { cardRouter };
