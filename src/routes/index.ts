import { Router } from "express";

import { cardRouter } from "./card.routes";
import { rechargeRouter } from "./recharge.routes";

const router = Router();

router.use(cardRouter);
router.use(rechargeRouter);

export default router;
