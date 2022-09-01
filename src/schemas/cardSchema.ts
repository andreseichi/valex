import joi from "joi";

export const apiKeySchema = joi
  .object({
    "x-api-key": joi.string().required(),
  })
  .unknown(true);

export const createCardSchema = joi.object({
  type: joi
    .string()
    .valid("groceries", "restaurants", "transport", "education", "health")
    .required(),
  employeeId: joi.number().required(),
});
