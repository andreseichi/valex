import { Router } from "express";
import { purchase } from "../controllers/purchaseController";
import { validateSchema } from "../middlewares/schemaMiddleware";
import { purchaseSchema } from "../schemas/purschageSchema";

const purchaseRouter = Router();

purchaseRouter.post("/card/purchase", validateSchema(purchaseSchema), purchase);

export { purchaseRouter };
