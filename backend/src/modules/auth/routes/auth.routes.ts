import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '@core/middleware/auth.middleware';

/**
 * Auth routes
 */
const router = Router();
const authController = new AuthController();

/**
 * @route   GET /api/v1/auth/health
 * @desc    Health check for auth service
 * @access  Public
 */
router.get('/health', authController.healthCheck);

/**
 * @route   POST /api/v1/auth/webhook/clerk
 * @desc    Handle Clerk webhook events
 * @access  Public (but should be secured with webhook secret in production)
 */
router.post('/webhook/clerk', authController.handleClerkWebhook);

/**
 * @route   GET /api/v1/auth/verify
 * @desc    Verify user session
 * @access  Private
 */
router.get('/verify', authenticate, authController.verifySession);

export default router;
