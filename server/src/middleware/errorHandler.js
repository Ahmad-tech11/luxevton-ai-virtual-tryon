const { AppError } = require('../utils/AppError');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    message = `Duplicate value for ${field}. Please use another value.`;
  }

  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size cannot exceed 10MB';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field';
    } else {
      message = err.message;
    }
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please log in again.';
  }

  if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    if (err instanceof AppError && err.isOperational) {
      return res.status(statusCode).json({
        message,
        ...(err.errors ? { errors: err.errors } : {}),
      });
    }

    logger.error('Unexpected error', { error: err.message, stack: err.stack, path: req.path, method: req.method, ip: req.ip });

    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }

  res.status(statusCode).json({
    message,
    stack: err.stack,
    ...(err.errors ? { errors: err.errors } : {}),
  });
};

module.exports = errorHandler;