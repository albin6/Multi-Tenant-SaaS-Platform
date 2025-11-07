import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '@core/middleware/auth.middleware';
import { validate } from '@core/middleware/validation.middleware';
import { updateUserSchema, getUserQuerySchema } from '../dto/user.dto';

/**
 * User routes
 */
const router = Router();
const userController = new UserController();

/**
 * @route   GET /api/v1/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, userController.getCurrentUser);

/**
 * @route   PATCH /api/v1/users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.patch(
  '/me',
  authenticate,
  validate(updateUserSchema, 'body'),
  userController.updateCurrentUser
);

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
router.get('/', authenticate, validate(getUserQuerySchema, 'query'), userController.getAllUsers);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', authenticate, userController.getUserById);

/**
 * @route   PATCH /api/v1/users/:id
 * @desc    Update user by ID (admin only)
 * @access  Private/Admin
 */
router.patch('/:id', authenticate, validate(updateUserSchema, 'body'), userController.updateUser);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user by ID (admin only)
 * @access  Private/Admin
 */
router.delete('/:id', authenticate, userController.deleteUser);

export default router;
