import { z } from 'zod';

/**
 * Phase 1: Company Registration DTO
 */
export const createOrganizationPhase1Schema = z.object({
  companyName: z.string().min(2).max(200),
  companyEmail: z.string().email(),
  companyAddress: z.object({
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    country: z.string().min(2),
    zipCode: z.string().min(3).max(10),
  }),
});

export type CreateOrganizationPhase1DTO = z.infer<
  typeof createOrganizationPhase1Schema
>;

/**
 * Phase 2: Email Verification DTO
 */
export const verifyOrganizationEmailSchema = z.object({
  organizationId: z.string(),
  verificationToken: z.string(),
});

export type VerifyOrganizationEmailDTO = z.infer<
  typeof verifyOrganizationEmailSchema
>;

/**
 * Phase 3: Orgname Creation DTO
 */
export const createOrgnameSchema = z.object({
  organizationId: z.string(),
  orgname: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Orgname can only contain lowercase letters, numbers, and hyphens')
    .refine((val) => !val.startsWith('-') && !val.endsWith('-'), {
      message: 'Orgname cannot start or end with a hyphen',
    }),
});

export type CreateOrgnameDTO = z.infer<typeof createOrgnameSchema>;

/**
 * Check Orgname Availability DTO
 */
export const checkOrgnameAvailabilitySchema = z.object({
  orgname: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
});

export type CheckOrgnameAvailabilityDTO = z.infer<
  typeof checkOrgnameAvailabilitySchema
>;

/**
 * Update Organization DTO
 */
export const updateOrganizationSchema = z.object({
  companyName: z.string().min(2).max(200).optional(),
  companyEmail: z.string().email().optional(),
  companyAddress: z
    .object({
      street: z.string().min(5),
      city: z.string().min(2),
      state: z.string().min(2),
      country: z.string().min(2),
      zipCode: z.string().min(3).max(10),
    })
    .optional(),
  metadata: z
    .object({
      logo: z.string().url().optional(),
      description: z.string().max(500).optional(),
      website: z.string().url().optional(),
      industry: z.string().max(100).optional(),
    })
    .optional(),
});

export type UpdateOrganizationDTO = z.infer<typeof updateOrganizationSchema>;

/**
 * Create Subscription DTO
 */
export const createSubscriptionSchema = z.object({
  organizationId: z.string(),
  planId: z.string(),
  razorpayPaymentId: z.string(),
  razorpayOrderId: z.string(),
  razorpaySignature: z.string(),
});

export type CreateSubscriptionDTO = z.infer<typeof createSubscriptionSchema>;
