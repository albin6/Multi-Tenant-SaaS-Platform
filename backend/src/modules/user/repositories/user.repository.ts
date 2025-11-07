import { FilterQuery } from 'mongoose';
import { IUser, UserModel } from '../models/user.model';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { PaginationOptions, PaginatedResponse } from '@shared/interfaces/base.interface';
import { logger } from '@core/utils/logger';

/**
 * User Repository
 * Handles all database operations for users
 */
export class UserRepository {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<IUser | null> {
    try {
      return await UserModel.findById(id);
    } catch (error) {
      logger.error({ error, id }, 'Error finding user by ID');
      throw error;
    }
  }

  /**
   * Find user by Clerk ID
   */
  async findByClerkId(clerkId: string): Promise<IUser | null> {
    try {
      return await UserModel.findOne({ clerkId });
    } catch (error) {
      logger.error({ error, clerkId }, 'Error finding user by Clerk ID');
      throw error;
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await UserModel.findOne({ email: email.toLowerCase() });
    } catch (error) {
      logger.error({ error, email }, 'Error finding user by email');
      throw error;
    }
  }

  /**
   * Find all users with pagination
   */
  async findAll(
    filter: FilterQuery<IUser> = {},
    options: PaginationOptions
  ): Promise<PaginatedResponse<IUser>> {
    try {
      const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = options;
      const skip = (page - 1) * limit;

      const query = UserModel.find(filter);
      const total = await UserModel.countDocuments(filter);

      const users = await query
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      return {
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error({ error, filter, options }, 'Error finding all users');
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async create(data: CreateUserDto): Promise<IUser> {
    try {
      const user = new UserModel(data);
      return await user.save();
    } catch (error) {
      logger.error({ error, data }, 'Error creating user');
      throw error;
    }
  }

  /**
   * Update user by ID
   */
  async update(id: string, data: UpdateUserDto): Promise<IUser | null> {
    try {
      return await UserModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );
    } catch (error) {
      logger.error({ error, id, data }, 'Error updating user');
      throw error;
    }
  }

  /**
   * Update user by Clerk ID
   */
  async updateByClerkId(clerkId: string, data: UpdateUserDto): Promise<IUser | null> {
    try {
      return await UserModel.findOneAndUpdate(
        { clerkId },
        { $set: data },
        { new: true, runValidators: true }
      );
    } catch (error) {
      logger.error({ error, clerkId, data }, 'Error updating user by Clerk ID');
      throw error;
    }
  }

  /**
   * Update last login time
   */
  async updateLastLogin(id: string): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(id, { lastLoginAt: new Date() });
    } catch (error) {
      logger.error({ error, id }, 'Error updating last login');
      throw error;
    }
  }

  /**
   * Delete user by ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await UserModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error({ error, id }, 'Error deleting user');
      throw error;
    }
  }

  /**
   * Delete user by Clerk ID
   */
  async deleteByClerkId(clerkId: string): Promise<boolean> {
    try {
      const result = await UserModel.findOneAndDelete({ clerkId });
      return result !== null;
    } catch (error) {
      logger.error({ error, clerkId }, 'Error deleting user by Clerk ID');
      throw error;
    }
  }

  /**
   * Check if user exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    try {
      const count = await UserModel.countDocuments({ email: email.toLowerCase() });
      return count > 0;
    } catch (error) {
      logger.error({ error, email }, 'Error checking user existence by email');
      throw error;
    }
  }
}
