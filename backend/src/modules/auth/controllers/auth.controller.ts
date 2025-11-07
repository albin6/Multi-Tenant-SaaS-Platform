import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { HTTP_STATUS } from '@shared/constants/http-status';
import { asyncHandler } from '@core/middleware/error.middleware';
import { logger } from '@core/utils/logger';

/**
 * Auth Controller
 * Handles authentication-related HTTP requests
 */
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Clerk webhook handler
   * POST /api/v1/auth/webhook/clerk
   *
   * Handles Clerk webhook events:
   * - user.created
   * - user.updated
   * - user.deleted
   */
  handleClerkWebhook = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { type, data } = req.body;

    logger.info({ type, userId: data.id }, 'Received Clerk webhook');

    try {
      switch (type) {
        case 'user.created':
        case 'user.updated': {
          const primaryEmail =
            data.email_addresses.find(
              (email: { id: string }) => email.id === data.primary_email_address_id
            ) || data.email_addresses[0];

          await this.authService.syncUserFromClerk({
            clerkId: data.id,
            email: primaryEmail.email_address,
            firstName: data.first_name || undefined,
            lastName: data.last_name || undefined,
            username: data.username || undefined,
            profileImageUrl: data.profile_image_url || undefined,
          });
          break;
        }

        case 'user.deleted': {
          await this.authService.deleteUserFromClerk(data.id);
          break;
        }

        default:
          logger.warn({ type }, 'Unhandled Clerk webhook event');
      }

      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'Webhook processed successfully',
      });
    } catch (error) {
      logger.error({ error, type }, 'Error processing Clerk webhook');
      throw error;
    }
  });

  /**
   * Verify session
   * GET /api/v1/auth/verify
   */
  verifySession = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const clerkId = req.clerkUserId!;

    const user = await this.authService.verifyUserSession(clerkId);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: { user },
      message: 'Session verified',
    });
  });

  /**
   * Health check for auth service
   * GET /api/v1/auth/health
   */
  healthCheck = asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Auth service is healthy',
      timestamp: new Date().toISOString(),
    });
  });
}
