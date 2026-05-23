import express from "express";

import authRoutes from "./authRoutes.js";
import orderRoutes from "./orderRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/orders", orderRoutes);
router.use("/admin", adminRoutes);

export default router;
