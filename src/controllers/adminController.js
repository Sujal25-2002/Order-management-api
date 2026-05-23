import asyncHandler from "../utils/asyncHandler.js";
import { findAllOrders } from "../models/orderModel.js";
import { getPagination } from "../utils/pagination.js";
import { sendSuccess } from "../utils/response.js";

const getAllOrders = asyncHandler(async (request, response) => {
  const pagination = getPagination(request.validatedQuery || request.query);
  const result = await findAllOrders(pagination);

  return sendSuccess(response, 200, "All orders fetched successfully.", result.rows, {
    page: pagination.page,
    limit: pagination.limit,
    total: result.total,
    totalPages: Math.ceil(result.total / pagination.limit) || 1,
  });
});

export { getAllOrders };
