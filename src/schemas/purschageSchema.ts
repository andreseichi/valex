import joi from "joi";

export const purchaseSchema = joi.object({
  number: joi.string().required(),
  cardholderName: joi.string().required(),
  expirationDate: joi.string().required(),
  password: joi.number().required(),
  businessId: joi.number().required(),
  amount: joi.number().greater(0).required(),
});
