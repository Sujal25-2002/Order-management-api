import Joi from "joi";

const adminOrdersQuerySchema = Joi.object({
  page: Joi.number().integer().positive().optional(),
  limit: Joi.number().integer().positive().max(100).optional(),
});

export { adminOrdersQuerySchema };
