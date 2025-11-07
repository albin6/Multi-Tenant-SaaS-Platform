import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { HTTP_STATUS } from '@shared/constants/http-status';
import { asyncHandler } from '@core/middleware/error.middleware';
import { GetUserQueryDto, UpdateUserDto } from '../dto/user.dto';

/**
 * User Controller
 * Handles HTTP requests for user operations
 */
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get current user profile
   * GET /api/v1/users/me
   */
  getCurrentUser = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const clerkId = req.clerkUserId!;

    const user = await this.userService.getCurrentUserProfile(clerkId);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: { user },
    });
  });

  /**
   * Get user by ID
   * GET /api/v1/users/:id
   */
  getUserById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    const user = await this.userService.getUserById(id);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: { user },
    });
  });

  /**
   * Get all users (admin only)
   * GET /api/v1/users
   */
  getAllUsers = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const query = req.query as unknown as GetUserQueryDto;

    const result = await this.userService.getAllUsers(query);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: result.data,
      pagination: result.pagination,
    });
  });

  /**
   * Update current user profile
   * PATCH /api/v1/users/me
   */
  updateCurrentUser = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const clerkId = req.clerkUserId!;
    const data: UpdateUserDto = req.body;

    const user = await this.userService.updateUserByClerkId(clerkId, data);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: { user },
      message: 'Profile updated successfully',
    });
  });

  /**
   * Update user by ID (admin only)
   * PATCH /api/v1/users/:id
   */
  updateUser = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const data: UpdateUserDto = req.body;

    const user = await this.userService.updateUser(id, data);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: { user },
      message: 'User updated successfully',
    });
  });

  /**
   * Delete user by ID (admin only)
   * DELETE /api/v1/users/:id
   */
  deleteUser = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    await this.userService.deleteUser(id);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}
