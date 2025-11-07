import { Request, Response, NextFunction } from 'express';
import { RazorpayService } from '../services/razorpay.service';
import { MockPaymentService } from '../services/mock-payment.service';
import { logger } from '@core/utils/logger';

/**
 * Payment Controller
 * Handles payment-related HTTP requests
 */
export class PaymentController {
  private service: RazorpayService | MockPaymentService;

  constructor() {
    // Use mock service if Razorpay credentials not configured
    const useMock = !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET;
    
    if (useMock) {
      logger.warn('Using Mock Payment Service - No real payments will be processed');
      this.service = new MockPaymentService();
    } else {
      this.service = new RazorpayService();
    }
  }

  /**
   * Create payment order
   * POST /api/v1/payments/create-order
   */
  createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { planId, organizationId } = req.body;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const order = await this.service.createOrder(planId, organizationId);

      res.status(200).json({
        success: true,
        message: 'Order created successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Verify payment and activate subscription
   * POST /api/v1/payments/verify
   */
  verifyPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        organizationId,
        planId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      } = req.body;

      const result = await this.service.activateSubscription(
        organizationId,
        planId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature
      );

      res.status(200).json({
        success: true,
        message: 'Payment verified and subscription activated',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get subscription details
   * GET /api/v1/payments/subscription/:organizationId
   */
  getSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { organizationId } = req.params;

      const subscription = await this.service.getSubscriptionDetails(organizationId);

      res.status(200).json({
        success: true,
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Cancel subscription
   * POST /api/v1/payments/cancel-subscription
   */
  cancelSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { organizationId } = req.body;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const organization = await this.service.cancelSubscription(organizationId);

      res.status(200).json({
        success: true,
        message: 'Subscription cancelled successfully',
        data: organization,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Razorpay webhook handler
   * POST /api/v1/payments/webhook
   */
  handleWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const payload = req.body;

      await this.service.handleWebhook(payload, signature);

      res.status(200).json({ success: true });
    } catch (error) {
      logger.error({ error }, 'Webhook processing error');
      next(error);
    }
  };
}
