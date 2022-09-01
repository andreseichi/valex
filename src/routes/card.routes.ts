import { Router } from "express";
import { createCard } from "../controllers/cardController";
import {
  validateHeaderSchema,
  validateSchema,
} from "../middlewares/schemaMiddleware";
import { apiKeySchema, createCardSchema } from "../schemas/cardSchema";

const cardRouter = Router();

cardRouter.post(
  "/card",
  validateHeaderSchema(apiKeySchema),
  validateSchema(createCardSchema),
  createCard
);

export { cardRouter };
