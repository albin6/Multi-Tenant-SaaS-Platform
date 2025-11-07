import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate } from '@core/middleware/auth.middleware';

const router = Router();
const controller = new PaymentController();

/**
 * Create payment order
 * Requires authentication
 */
router.post('/create-order', authenticate, controller.createOrder);

/**
 * Verify payment and activate subscription
 * Requires authentication
 */
router.post('/verify', authenticate, controller.verifyPayment);

/**
 * Get subscription details
 * Requires authentication
 */
router.get(
  '/subscription/:organizationId',
  authenticate,
  controller.getSubscription
);

/**
 * Cancel subscription
 * Requires authentication
 */
router.post('/cancel-subscription', authenticate, controller.cancelSubscription);

/**
 * Razorpay webhook endpoint
 * Public (verified via signature)
 */
router.post('/webhook', controller.handleWebhook);

export default router;
