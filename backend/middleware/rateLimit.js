import rateLimit from 'express-rate-limit';

// Analytics API rate limiting (higher limit for data-heavy operations)
export const analyticsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 analytics requests per windowMs
  message: {
    error: 'Too many analytics requests, please try again later.',
    retryAfter: '900' // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication rate limiting (stricter limits)
export const authRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit auth attempts to 5 per minute
  message: {
    error: 'Too many authentication attempts, please try again in a minute.',
    retryAfter: '60'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiting (moderate limits)
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 general API requests per windowMs
  message: {
    error: 'Too many API requests, please try again later.',
    retryAfter: '900'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Search and explore rate limiting
export const searchRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Limit search requests
  message: {
    error: 'Too many search requests, please try again later.',
    retryAfter: '300'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Create custom rate limiter for specific routes
export const createCustomRateLimit = (options) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message: options.message || {
      error: 'Rate limit exceeded, please try again later.',
      retryAfter: options.windowMs ? Math.ceil(options.windowMs / 1000).toString() : '900'
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...options
  });
};