// Input validation for POST (all fields required) and PUT (at least one field).
const ApiError = require('../utils/ApiError');

// field -> [min length, max length]
const RULES = {
  title: [3, 150],
  content: [10, 10000],
  author: [2, 60],
  category: [2, 40]
};

function check(body, requireAll) {
  const errors = [];

  for (const [field, [min, max]] of Object.entries(RULES)) {
    const value = body[field];

    if (value === undefined) {
      if (requireAll) errors.push(`'${field}' is required`);
      continue;
    }
    if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) {
      errors.push(`'${field}' must be a string of ${min}-${max} characters`);
    }
  }
  return errors;
}

exports.validateCreate = (req, res, next) => {
  const errors = check(req.body || {}, true);
  if (errors.length) return next(new ApiError(400, 'Validation failed', errors));
  next();
};

exports.validateUpdate = (req, res, next) => {
  const body = req.body || {};
  const hasField = Object.keys(RULES).some((f) => body[f] !== undefined);
  if (!hasField) {
    return next(new ApiError(400, 'Provide at least one of: title, content, author, category'));
  }
  const errors = check(body, false);
  if (errors.length) return next(new ApiError(400, 'Validation failed', errors));
  next();
};
