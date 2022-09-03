import joi from "joi";

export const apiKeySchema = joi
  .object({
    "x-api-key": joi.string().required(),
  })
  .unknown(true);
