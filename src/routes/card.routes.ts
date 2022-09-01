import { Router } from "express";
import { activateCard, createCard } from "../controllers/cardController";
import {
  validateHeaderSchema,
  validateSchema,
} from "../middlewares/schemaMiddleware";
import {
  activateCardSchema,
  apiKeySchema,
  createCardSchema,
} from "../schemas/cardSchema";

const cardRouter = Router();

cardRouter.post(
  "/card",
  validateHeaderSchema(apiKeySchema),
  validateSchema(createCardSchema),
  createCard
);

cardRouter.post("/activate", validateSchema(activateCardSchema), activateCard);

export { cardRouter };
