import express from "express";

import { login, register } from "../controllers/authController.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import { loginSchema, registerSchema } from "../validations/authValidation.js";

const router = express.Router();

router.post("/register", validateMiddleware(registerSchema), register);
router.post("/login", validateMiddleware(loginSchema), login);

export default router;
