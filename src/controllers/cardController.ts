import { Request, Response } from "express";

import { find } from "../repositories/cardRepository";

export async function getCards(req: Request, res: Response) {
  try {
    const rows = await find();

    console.log(rows);
  } catch (error) {}

  return res.send("get cards");
}
