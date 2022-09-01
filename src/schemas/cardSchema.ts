import joi from "joi";

export const apiKeySchema = joi
  .object({
    "x-api-key": joi.string().required(),
  })
  .unknown(true);

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
