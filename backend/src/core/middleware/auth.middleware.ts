import { Request, Response, NextFunction } from 'express';
import { verifyToken, createClerkClient, EmailAddress } from '@clerk/backend';
import { appConfig } from '../config/env.config';
import { UnauthorizedError } from '../utils/app-error';
import { logger } from '../utils/logger';
import { UserService } from '@modules/user/services/user.service';

// Create Clerk client instance
const clerkClient = createClerkClient({
  secretKey: appConfig.clerk.secretKey,
});

/**
 * Middleware to verify Clerk JWT token
 * Attaches user information to the request object
 * Auto-syncs user to MongoDB if not exists
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify the Clerk session token
      const verifiedToken = await verifyToken(token, {
        secretKey: appConfig.clerk.secretKey,
      });

      // Attach user ID to request
      req.clerkUserId = verifiedToken.sub;
      req.userId = verifiedToken.sub;

      // Auto-sync user to MongoDB if not exists
      await syncUserIfNeeded(verifiedToken.sub);

      logger.debug({ userId: req.userId }, 'User authenticated successfully');

      next();
    } catch (error) {
      logger.error({ error }, 'Token verification failed');
      throw new UnauthorizedError('Invalid or expired token');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Auto-sync user from Clerk to MongoDB
 * Creates user in MongoDB if they don't exist
 */
async function syncUserIfNeeded(clerkId: string): Promise<void> {
  try {
    const userService = new UserService();

    // Check if user exists in MongoDB
    try {
      await userService.getUserByClerkId(clerkId);
      // User exists, no need to sync
      return;
    } catch (error) {
      // User doesn't exist, fetch from Clerk and create
      logger.info({ clerkId }, 'User not found in MongoDB, syncing from Clerk');

      const clerkUser = await clerkClient.users.getUser(clerkId);

      const primaryEmail =
        clerkUser.emailAddresses.find(
          (email: EmailAddress) => email.id === clerkUser.primaryEmailAddressId
        ) || clerkUser.emailAddresses[0];

      if (!primaryEmail) {
        logger.error({ clerkId }, 'No email address found for user');
        return;
      }

      await userService.getOrCreateUser({
        clerkId: clerkUser.id,
        email: primaryEmail.emailAddress,
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined,
        username: clerkUser.username || undefined,
        profileImageUrl: clerkUser.imageUrl || undefined,
      });

      logger.info({ clerkId }, 'User successfully synced to MongoDB');
    }
  } catch (error) {
    logger.error({ error, clerkId }, 'Failed to sync user from Clerk');
    // Don't throw error, allow request to continue
  }
}

/**
 * Optional authentication middleware
 * Attaches user information if token is present, but doesn't fail if not
 */
export const optionalAuthenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const verifiedToken = await verifyToken(token, {
          secretKey: appConfig.clerk.secretKey,
        });

        req.clerkUserId = verifiedToken.sub;
        req.userId = verifiedToken.sub;
      } catch (error) {
        // Silently fail for optional authentication
        logger.debug({ error }, 'Optional authentication failed');
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
