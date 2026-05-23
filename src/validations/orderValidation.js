import Joi from "joi";

import { ORDER_STATUSES, ORDER_TYPES } from "../utils/constants.js";

// CANCELLED is excluded — use PATCH /:id/cancel for cancellation.
const ORDER_STATUSES_UPDATABLE = ORDER_STATUSES.filter((s) => s !== "CANCELLED");

const createOrderSchema = Joi.object({
  symbol: Joi.string().trim().uppercase().min(1).max(20).required(),
  order_type: Joi.string().valid(...ORDER_TYPES).required(),
  quantity: Joi.number().integer().positive().required(),
  price: Joi.number().positive().precision(2).required(),
});

const updateOrderSchema = Joi.object({
  symbol: Joi.string().trim().uppercase().min(1).max(20).required(),
  order_type: Joi.string().valid(...ORDER_TYPES).required(),
  quantity: Joi.number().integer().positive().required(),
  price: Joi.number().positive().precision(2).required(),
  // Only PENDING or COMPLETED allowed via PUT; cancellation must go through PATCH /:id/cancel.
  status: Joi.string().valid(...ORDER_STATUSES_UPDATABLE).optional(),
});

const orderIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const myOrdersQuerySchema = Joi.object({
  page: Joi.number().integer().positive().optional(),
  limit: Joi.number().integer().positive().max(100).optional(),
});

export { createOrderSchema, updateOrderSchema, orderIdSchema, myOrdersQuerySchema };
