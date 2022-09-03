import joi from "joi";

export const createCardSchema = joi.object({
  type: joi
    .string()
    .valid("groceries", "restaurant", "transport", "education", "health")
    .required(),
  employeeId: joi.number().required(),
});

export const activateCardSchema = joi.object({
  number: joi.string().required(),
  cardholderName: joi.string().required(),
  expirationDate: joi.string().required(),
  CVC: joi.string().required(),
  password: joi.number().required(),
});

export const balanceCardSchema = joi.object({
  number: joi.string().required(),
  cardholderName: joi.string().required(),
  expirationDate: joi.string().required(),
});

export const validateCardSchema = joi.object({
  number: joi.string().required(),
  cardholderName: joi.string().required(),
  expirationDate: joi.string().required(),
  password: joi.number().required(),
});
