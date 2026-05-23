import express from "express";

import { getAllOrders } from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import { adminOrdersQuerySchema } from "../validations/adminValidation.js";

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(["ADMIN"]));
router.get("/get_all_orders", validateMiddleware(adminOrdersQuerySchema, "query"), getAllOrders);

export default router;
