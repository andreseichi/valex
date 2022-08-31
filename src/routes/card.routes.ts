import { Router } from "express";

const cardRouter = Router();

cardRouter.get("/cards", (req, res) => {
  console.log("hello");

  return res.send("hello");
});

cardRouter.post("/cards");

export { cardRouter };
