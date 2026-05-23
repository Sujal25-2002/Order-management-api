import express from "express";

import {
  createOrder,
  deleteOrder,
  getMyOrders,
  getOrderById,
  updateOrder,
} from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import {
  createOrderSchema,
  myOrdersQuerySchema,
  orderIdSchema,
  updateOrderSchema,
} from "../validations/orderValidation.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/create_order", validateMiddleware(createOrderSchema), createOrder);
router.get("/get_orders", validateMiddleware(myOrdersQuerySchema, "query"), getMyOrders);
router.get("/get_order_by_id/:id", validateMiddleware(orderIdSchema, "params"), getOrderById);
router.put(
  "/update_order/:id",
  validateMiddleware(orderIdSchema, "params"),
  validateMiddleware(updateOrderSchema),
  updateOrder,
);
router.delete("/delete_order/:id", validateMiddleware(orderIdSchema, "params"), deleteOrder);

export default router;
