// backend/middleware/errorHandler.js
const globalErrorHandler = (err, req, res, next) => {
  console.error('Global Error Handler:', err.stack);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = null;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Input validation failed';
    details = Object.values(err.errors).map(error => error.message);
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate resource found';
  } else if (err.statusCode === 404) { // Fixed line
    statusCode = 404;
    message = 'Resource not found';
  }

  // If headers already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default globalErrorHandler;
