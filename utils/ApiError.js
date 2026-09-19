// Error with an HTTP status code attached, so handlers can just `throw` it.
class ApiError extends Error {
  constructor(statusCode, message, errors) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors; // optional list of field-level problems
  }
}

module.exports = ApiError;
