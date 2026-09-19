// 404 handler + one central error handler, so every error has the same JSON shape.
const ApiError = require('../utils/ApiError');

exports.notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  // Malformed JSON body (thrown by express.json())
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Malformed JSON in request body' });
  }

  const status = err.statusCode || 500;
  if (status === 500) console.error(err);

  const body = {
    success: false,
    message: status === 500 ? 'Internal server error' : err.message
  };
  if (err.errors) body.errors = err.errors;

  res.status(status).json(body);
};
