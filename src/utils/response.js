import { transformDates } from "./formatDate.js";

function sendSuccess(response, statusCode, message, data = null, meta = null) {
  const payload = {
    success: true,
    message,
  };

  if (data !== null) {
    payload.data = transformDates(data);
  }

  if (meta !== null) {
    payload.meta = meta;
  }

  return response.status(statusCode).json(payload);
}

export { sendSuccess };
