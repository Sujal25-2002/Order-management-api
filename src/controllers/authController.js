import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { signToken } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { sendSuccess } from "../utils/response.js";
import { createUser, findUserByEmail } from "../models/userModel.js";
import { buildAuthUser, buildTokenPayload } from "../services/authService.js";

const register = asyncHandler(async (request, response) => {
  const existingUser = await findUserByEmail(request.validatedBody.email);

  if (existingUser) {
    throw new AppError("User already exists with this email.", 409);
  }

  const passwordHash = await hashPassword(request.validatedBody.password);
  const user = await createUser({
    name: request.validatedBody.name,
    email: request.validatedBody.email,
    passwordHash,
  });

  const token = signToken(buildTokenPayload(user));

  return sendSuccess(response, 201, "User registered successfully.", {
    user: buildAuthUser(user),
    token,
  });
});

const login = asyncHandler(async (request, response) => {
  const user = await findUserByEmail(request.validatedBody.email);

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isPasswordValid = await comparePassword(
    request.validatedBody.password,
    user.password_hash,
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = signToken(buildTokenPayload(user));

  return sendSuccess(response, 200, "Login successful.", {
    user: buildAuthUser(user),
    token,
  });
});

export { register, login };
