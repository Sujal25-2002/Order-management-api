import AppError from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";
import { findUserById } from "../models/userModel.js";

async function authMiddleware(request, response, next) {
  void response;

  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authorization token is required.", 401);
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = verifyToken(token);
    const user = await findUserById(decodedToken.sub);

    if (!user) {
      throw new AppError("Authenticated user not found.", 401);
    }

    request.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    next(error);
  }
}

export default authMiddleware;
