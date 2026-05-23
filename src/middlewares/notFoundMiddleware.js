function notFoundMiddleware(request, response) {
  response.status(404).json({
    status: 404,
    success: false,
    message: `Route not found: ${request.originalUrl}`,
  });
}

export default notFoundMiddleware;
