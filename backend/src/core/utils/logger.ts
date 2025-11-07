import pino from 'pino';
import { appConfig } from '../config/env.config';

/**
 * Logger configuration using Pino
 * Provides structured logging with different levels
 */
const pinoConfig = {
  level: appConfig.logging.level,
  transport: appConfig.isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          singleLine: false,
        },
      }
    : undefined,
  formatters: {
    level: (label: string) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

/**
 * Global logger instance
 * Use this throughout the application for consistent logging
 */
export const logger = pino(pinoConfig);

/**
 * Create a child logger with additional context
 * @param context - Additional context to include in logs
 */
export const createLogger = (context: Record<string, unknown>) => {
  return logger.child(context);
};
