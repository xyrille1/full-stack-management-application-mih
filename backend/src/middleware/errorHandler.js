/** Unmatched route -> 404 rather than Express's default HTML page. */
export const notFound = (req, _res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
};

/**
 * Central error handler. Every failure leaves the API as { error: "<message>" }
 * so the frontend has one predictable shape to read a message from.
 */
// eslint-disable-next-line no-unused-vars -- Express identifies error middleware by arity.
export const errorHandler = (err, _req, res, _next) => {
  let status = err.status ?? 500;
  let message = err.message ?? 'Internal server error';

  // Schema validation failed (e.g. a title that slipped through as blank).
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  // A value could not be cast to its schema type, e.g. a malformed ObjectId.
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid value for '${err.path}'`;
  }

  if (status >= 500) console.error(err);

  res.status(status).json({ error: message });
};
