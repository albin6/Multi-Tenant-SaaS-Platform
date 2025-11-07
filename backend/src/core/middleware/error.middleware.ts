import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error';
import { logger } from '../utils/logger';
import { HTTP_STATUS } from '@shared/constants/http-status';

/**
 * Error response structure
 */
interface ErrorResponse {
  status: 'error';
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
  stack?: string;
  errors?: unknown;
}

/**
 * Global error handling middleware
 * Catches all errors thrown in the application
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let errors: unknown = undefined;

  // Handle different error types
  if (err instanceof AppError) {
    // Custom application errors
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    // Zod validation errors
    statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    message = 'Validation failed';
    errors = err.errors.map((error) => ({
      field: error.path.join('.'),
      message: error.message,
    }));
  } else if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    // MongoDB errors
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Database operation failed';
  } else if (err.name === 'ValidationError') {
    // Mongoose validation errors
    statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    message = 'Validation failed';
  } else if (err.name === 'CastError') {
    // Mongoose cast errors
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid ID format';
  } else if (err.name === 'JsonWebTokenError') {
    // JWT errors
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    // JWT expiration errors
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Token expired';
  }

  // Log error
  logger.error({
    err,
    statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Prepare error response
  const errorResponse: ErrorResponse = {
    status: 'error',
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Include validation errors if present
  if (errors) {
    errorResponse.errors = errors;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Handle 404 Not Found errors
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const message = `Route ${req.originalUrl} not found`;

  logger.warn({
    message,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  res.status(HTTP_STATUS.NOT_FOUND).json({
    status: 'error',
    message,
    statusCode: HTTP_STATUS.NOT_FOUND,
    timestamp: new Date().toISOString(),
    path: req.path,
  });
};

/**
 * Async handler wrapper to catch async errors
 * Eliminates the need for try-catch blocks in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
