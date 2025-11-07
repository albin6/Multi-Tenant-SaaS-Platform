import { IUser } from '@modules/user/models/user.model';

/**
 * Extend Express Request type to include custom properties
 */
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      userId?: string;
      clerkUserId?: string;
    }
  }
}

export {};
