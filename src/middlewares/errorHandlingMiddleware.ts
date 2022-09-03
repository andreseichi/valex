import { NextFunction, Request, Response } from "express";
import { errors } from "../types/errors";

export const errorHandlingMiddleware = (
  error: errors,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.type === "invalid_api_key")
    return res.status(401).send({ message: error.message });

  if (error.type === "invalid_employee_id")
    return res.status(404).send({ message: error.message });

  if (error.type === "card_already_exists")
    return res.status(409).send({ message: error.message });

  if (error.type === "invalid_card")
    return res.status(404).send({ message: error.message });

  if (error.type === "card_expired")
    return res.status(401).send({ message: error.message });

  if (error.type === "card_already_activated")
    return res.status(409).send({ message: error.message });

  if (error.type === "invalid_cvc")
    return res.status(401).send({ message: error.message });

  if (error.type === "invalid_password")
    return res.status(401).send({ message: error.message });

  if (error.type === "password_not_match")
    return res.status(401).send({ message: error.message });

  if (error.type === "card_already_blocked")
    return res.status(409).send({ message: error.message });

  if (error.type === "card_already_unblocked")
    return res.status(409).send({ message: error.message });

  if (error.type === "card_not_activated")
    return res.status(401).send({ message: error.message });

  if (error.type === "card_blocked")
    return res.status(401).send({ message: error.message });

  return res.sendStatus(500);
};
