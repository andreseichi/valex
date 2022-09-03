import { Router } from "express";
import { rechargeCard } from "../controllers/rechargeController";
import {
  validateHeaderSchema,
  validateSchema,
} from "../middlewares/schemaMiddleware";
import { apiKeySchema } from "../schemas/apiKeySchema";
import { rechargeSchema } from "../schemas/rechargeSchema";

const rechargeRouter = Router();

rechargeRouter.post(
  "/recharge",
  validateHeaderSchema(apiKeySchema),
  validateSchema(rechargeSchema),
  rechargeCard
);

export { rechargeRouter };
