/**
 * Rate limiting middleware
 */
const rateLimit = require("express-rate-limit");

// Create different rate limiters for different endpoints
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General API rate limiter
const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per 15 minutes
  "Too many requests from this IP, please try again later."
);

// Strict rate limiter for auth endpoints
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // 10 requests per 15 minutes
  "Too many authentication attempts, please try again later."
);

// Very strict rate limiter for registration
const registerLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3, // 3 registrations per hour
  "Too many registration attempts, please try again later."
);

module.exports = {
  apiLimiter,
  authLimiter,
  registerLimiter,
};
