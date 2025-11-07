import rateLimit from 'express-rate-limit';
import { appConfig } from '../config/env.config';
import { HTTP_STATUS } from '@shared/constants/http-status';

/**
 * Global rate limiter
 * Limits the number of requests from a single IP
 */
export const globalRateLimiter = rateLimit({
  windowMs: appConfig.rateLimit.windowMs,
  max: appConfig.rateLimit.maxRequests,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.',
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Auth rate limiter (stricter for authentication routes)
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later.',
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});
