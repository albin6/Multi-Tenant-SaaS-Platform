import { z } from 'zod';

/**
 * User creation schema (from Clerk webhook)
 */
export const createUserSchema = z.object({
  clerkId: z.string().min(1, 'Clerk ID is required'),
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  profileImageUrl: z.string().url().optional(),
});

/**
 * User update schema
 */
export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  username: z.string().min(3).max(30).optional(),
  profileImageUrl: z.string().url().optional(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * User query schema
 */
export const getUserQuerySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  role: z.enum(['user', 'admin']).optional(),
  isActive: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
});

/**
 * TypeScript types inferred from schemas
 */
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type GetUserQueryDto = z.infer<typeof getUserQuerySchema>;
