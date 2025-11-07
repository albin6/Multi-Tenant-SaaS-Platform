import { z } from 'zod';

/**
 * Clerk webhook event schema
 */
export const clerkWebhookSchema = z.object({
  type: z.string(),
  data: z.object({
    id: z.string(),
    email_addresses: z.array(
      z.object({
        email_address: z.string().email(),
        id: z.string(),
      })
    ),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    username: z.string().nullable().optional(),
    profile_image_url: z.string().url().optional(),
  }),
});

/**
 * Sync user with Clerk schema
 */
export const syncUserSchema = z.object({
  clerkId: z.string(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  profileImageUrl: z.string().url().optional(),
});

export type ClerkWebhookDto = z.infer<typeof clerkWebhookSchema>;
export type SyncUserDto = z.infer<typeof syncUserSchema>;
