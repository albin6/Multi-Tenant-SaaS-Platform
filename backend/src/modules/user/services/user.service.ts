import { FilterQuery } from 'mongoose';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto, UpdateUserDto, GetUserQueryDto } from '../dto/user.dto';
import { IUser } from '../models/user.model';
import { PaginatedResponse } from '@shared/interfaces/base.interface';
import { NotFoundError, ConflictError } from '@core/utils/app-error';
import { logger } from '@core/utils/logger';

/**
 * User Service
 * Contains business logic for user operations
 */
export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Get user by Clerk ID
   */
  async getUserByClerkId(clerkId: string): Promise<IUser> {
    const user = await this.userRepository.findByClerkId(clerkId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Get or create user (used after Clerk authentication)
   */
  async getOrCreateUser(data: CreateUserDto): Promise<IUser> {
    try {
      // Check if user already exists
      let user = await this.userRepository.findByClerkId(data.clerkId);

      if (user) {
        // Update last login
        await this.userRepository.updateLastLogin(user._id);
        return user;
      }

      // Check if email is already in use
      const existingEmail = await this.userRepository.existsByEmail(data.email);
      if (existingEmail) {
        throw new ConflictError('Email already in use');
      }

      // Create new user
      user = await this.userRepository.create(data);
      logger.info({ userId: user._id }, 'New user created');

      return user;
    } catch (error) {
      logger.error({ error, data }, 'Error in getOrCreateUser');
      throw error;
    }
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(query: GetUserQueryDto): Promise<PaginatedResponse<IUser>> {
    const { page, limit, sortBy, sortOrder, role, isActive } = query;

    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive;

    return await this.userRepository.findAll(filter as FilterQuery<IUser>, {
      page,
      limit,
      sortBy,
      sortOrder,
    });
  }

  /**
   * Update user profile
   */
  async updateUser(id: string, data: UpdateUserDto): Promise<IUser> {
    const user = await this.userRepository.update(id, data);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    logger.info({ userId: id }, 'User updated');
    return user;
  }

  /**
   * Update user by Clerk ID
   */
  async updateUserByClerkId(clerkId: string, data: UpdateUserDto): Promise<IUser> {
    const user = await this.userRepository.updateByClerkId(clerkId, data);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    logger.info({ clerkId }, 'User updated by Clerk ID');
    return user;
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError('User not found');
    }

    logger.info({ userId: id }, 'User deleted');
  }

  /**
   * Delete user by Clerk ID
   */
  async deleteUserByClerkId(clerkId: string): Promise<void> {
    const deleted = await this.userRepository.deleteByClerkId(clerkId);

    if (!deleted) {
      throw new NotFoundError('User not found');
    }

    logger.info({ clerkId }, 'User deleted by Clerk ID');
  }

  /**
   * Get current user profile
   */
  async getCurrentUserProfile(clerkId: string): Promise<IUser> {
    return await this.getUserByClerkId(clerkId);
  }
}
