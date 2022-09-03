import joi from "joi";

export const createCardSchema = joi.object({
  type: joi
    .string()
    .valid("groceries", "restaurant", "transport", "education", "health")
    .required(),
  employeeId: joi.number().required(),
});

export const activateCardSchema = joi.object({
  id: joi.number().required(),
  CVC: joi.string().required(),
  password: joi.number().required(),
});

export const blockUnblockCardSchema = joi.object({
  number: joi.string().required(),
  cardholderName: joi.string().required(),
  expirationDate: joi.string().required(),
  password: joi.number().required(),
});
