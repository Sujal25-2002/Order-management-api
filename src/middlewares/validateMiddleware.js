function validateMiddleware(schema, source = "body") {
  return (request, response, next) => {
    void response;

    const { error, value } = schema.validate(request[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(error);
    }

    request[`validated${source.charAt(0).toUpperCase()}${source.slice(1)}`] = value;
    return next();
  };
}

export default validateMiddleware;
