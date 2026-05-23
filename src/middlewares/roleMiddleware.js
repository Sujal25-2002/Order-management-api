import AppError from "../utils/AppError.js";

function roleMiddleware(allowedRoles) {
  return (request, response, next) => {
    void response;

    if (!request.user || !allowedRoles.includes(request.user.role)) {
      return next(new AppError("You are not authorized to access this resource.", 403));
    }

    return next();
  };
}

export default roleMiddleware;
