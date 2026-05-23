import AppError from "../utils/AppError.js";

function errorMiddleware(error, request, response, next) {
  void request;
  void next;

  if (error.isJoi) {
    return response.status(400).json({
      status: 400,
      success: false,
      message: "Validation failed.",
      errors: error.details.map((detail) => detail.message),
    });
  }

  if (error.code === "23505") {
    return response.status(409).json({
      status: 409,
      success: false,
      message: "A record with this value already exists.",
    });
  }

  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    return response.status(401).json({
      status: 401,
      success: false,
      message: "Invalid or expired token.",
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: 500,
    success: false,
    message: "Internal server error.",
  });
}

export default errorMiddleware;
