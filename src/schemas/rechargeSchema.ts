import joi from "joi";

export const rechargeSchema = joi.object({
  number: joi.string().required(),
  fullName: joi.string().required(),
  expirationDate: joi.string().required(),
  amount: joi.number().greater(0).required(),
});
