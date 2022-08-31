import { Router } from "express";

import { cardRouter } from "./card.routes";

const router = Router();

router.use(cardRouter);

export default router;
