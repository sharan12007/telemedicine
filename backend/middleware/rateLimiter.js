const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General API rate limiter
const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many API requests, please try again later.'
);

// Auth route rate limiter
const authLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  5, // limit each IP to 5 auth requests per windowMs
  'Too many authentication attempts, please try again later.'
);

module.exports = {
  apiLimiter,
  authLimiter
};