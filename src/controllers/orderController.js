import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";
import { sendSuccess } from "../utils/response.js";
import {
  createOrder as createOrderRecord,
  deleteOrderById,
  findOrderByIdAndUserId,
  findOrdersByUserId,
  updateOrderById,
} from "../models/orderModel.js";

const createOrder = asyncHandler(async (request, response) => {
  const order = await createOrderRecord({
    userId: request.user.id,
    symbol: request.validatedBody.symbol,
    orderType: request.validatedBody.order_type,
    quantity: request.validatedBody.quantity,
    price: request.validatedBody.price,
  });

  return sendSuccess(response, 201, "Order created successfully.", order);
});

const getMyOrders = asyncHandler(async (request, response) => {
  const pagination = getPagination(request.validatedQuery || request.query);
  const result = await findOrdersByUserId(request.user.id, pagination);

  return sendSuccess(response, 200, "Orders fetched successfully.", result.rows, {
    page: pagination.page,
    limit: pagination.limit,
    total: result.total,
    totalPages: Math.ceil(result.total / pagination.limit) || 1,
  });
});

const getOrderById = asyncHandler(async (request, response) => {
  const order = await findOrderByIdAndUserId(Number(request.validatedParams.id), request.user.id);

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  return sendSuccess(response, 200, "Order fetched successfully.", order);
});

const updateOrder = asyncHandler(async (request, response) => {
  const orderId = Number(request.validatedParams.id);
  const existingOrder = await findOrderByIdAndUserId(orderId, request.user.id);

  if (!existingOrder) {
    throw new AppError("Order not found.", 404);
  }

  if (existingOrder.status === "CANCELLED") {
    throw new AppError("Cancelled orders cannot be updated.", 400);
  }

  const order = await updateOrderById(orderId, {
    symbol: request.validatedBody.symbol,
    orderType: request.validatedBody.order_type,
    quantity: request.validatedBody.quantity,
    price: request.validatedBody.price,
    status: request.validatedBody.status || existingOrder.status,
  });

  return sendSuccess(response, 200, "Order updated successfully.", order);
});

const deleteOrder = asyncHandler(async (request, response) => {
  const orderId = Number(request.validatedParams.id);
  const existingOrder = await findOrderByIdAndUserId(orderId, request.user.id);

  if (!existingOrder) {
    throw new AppError("Order not found.", 404);
  }

  await deleteOrderById(orderId);

  return sendSuccess(response, 200, "Order deleted successfully.", null);
});

export { createOrder, getMyOrders, getOrderById, updateOrder, deleteOrder };
