import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../utils/app-error';

/**
 * Request validation locations
 */
type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Validation middleware factory
 * Validates request data against a Zod schema
 */
export const validate = (schema: AnyZodObject, target: ValidationTarget = 'body') => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get the data to validate based on target
      const dataToValidate = req[target];

      // Parse and validate data
      const validated = await schema.parseAsync(dataToValidate);

      // Replace request data with validated data
      req[target] = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        next(
          new ValidationError(
            `Validation failed for ${target}: ${formattedErrors
              .map((e) => `${e.field} - ${e.message}`)
              .join(', ')}`
          )
        );
      } else {
        next(error);
      }
    }
  };
};
