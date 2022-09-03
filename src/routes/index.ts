import { Router } from "express";

import { cardRouter } from "./card.routes";
import { rechargeRouter } from "./recharge.routes";
import { purchaseRouter } from "./purchase.routes";

const router = Router();

router.use(cardRouter);
router.use(rechargeRouter);
router.use(purchaseRouter);

export default router;
