import { UserService } from '@modules/user/services/user.service';
import { SyncUserDto } from '../dto/auth.dto';
import { IUser } from '@modules/user/models/user.model';
import { logger } from '@core/utils/logger';

/**
 * Auth Service
 * Handles authentication-related business logic
 */
export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Sync user from Clerk webhook
   * Creates or updates user based on Clerk data
   */
  async syncUserFromClerk(data: SyncUserDto): Promise<IUser> {
    try {
      const userData = {
        clerkId: data.clerkId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        profileImageUrl: data.profileImageUrl,
      };

      const user = await this.userService.getOrCreateUser(userData);
      logger.info({ userId: user._id, clerkId: data.clerkId }, 'User synced from Clerk');

      return user;
    } catch (error) {
      logger.error({ error, data }, 'Error syncing user from Clerk');
      throw error;
    }
  }

  /**
   * Handle user deletion from Clerk
   */
  async deleteUserFromClerk(clerkId: string): Promise<void> {
    try {
      await this.userService.deleteUserByClerkId(clerkId);
      logger.info({ clerkId }, 'User deleted from Clerk webhook');
    } catch (error) {
      logger.error({ error, clerkId }, 'Error deleting user from Clerk');
      throw error;
    }
  }

  /**
   * Verify user session
   * Used for protected routes
   */
  async verifyUserSession(clerkId: string): Promise<IUser> {
    try {
      const user = await this.userService.getUserByClerkId(clerkId);
      return user;
    } catch (error) {
      logger.error({ error, clerkId }, 'Error verifying user session');
      throw error;
    }
  }
}
