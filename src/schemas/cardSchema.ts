import joi from "joi";

export const apiKeySchema = joi
  .object({
    "x-api-key": joi.string().required(),
  })
  .unknown(true);

export const typeCardSchema = joi.object({
  type: joi
    .string()
    .valid("groceries", "restaurants", "transport", "education", "health")
    .required(),
});
