import Razorpay from 'razorpay';
import crypto from 'crypto';
import { OrganizationModel } from '@modules/organization/models/organization.model';
import { PlanModel } from '@modules/organization/models/plan.model';
import { logger } from '@core/utils/logger';
import { BadRequestError, NotFoundError } from '@core/utils/app-error';

/**
 * Razorpay Service
 * Handles payment processing and subscription management
 */
export class RazorpayService {
  private razorpay: Razorpay;

  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      logger.warn('Razorpay credentials not configured');
      // Initialize with dummy values for development
      this.razorpay = new Razorpay({
        key_id: keyId || 'test_key',
        key_secret: keySecret || 'test_secret',
      });
    } else {
      this.razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    }
  }

  /**
   * Create a Razorpay order for plan purchase
   */
  async createOrder(planId: string, organizationId: string) {
    try {
      // Find plan
      const plan = await PlanModel.findById(planId);
      if (!plan) {
        throw new NotFoundError('Plan not found');
      }

      // Find organization
      const organization = await OrganizationModel.findById(organizationId);
      if (!organization) {
        throw new NotFoundError('Organization not found');
      }

      // Create Razorpay order
      // Receipt must be max 40 chars - use timestamp + short IDs
      const timestamp = Date.now();
      const shortOrgId = organizationId.toString().slice(-8);
      const shortPlanId = planId.toString().slice(-6);
      const receipt = `${timestamp}_${shortOrgId}_${shortPlanId}`;

      const order = await this.razorpay.orders.create({
        amount: plan.price * 100, // Convert to paise
        currency: plan.currency,
        receipt, // Max 40 chars
        notes: {
          organizationId,
          planId,
          orgname: organization.orgname || '',
          companyName: organization.companyName || '',
        },
      });

      logger.info({
        orderId: order.id,
        organizationId,
        planId,
        amount: plan.price,
      }, 'Razorpay order created');

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        planName: plan.name,
        planPrice: plan.price,
      };
    } catch (error) {
      logger.error({ error, planId, organizationId }, 'Error creating Razorpay order');
      throw error;
    }
  }

  /**
   * Verify Razorpay payment signature
   */
  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    try {
      const keySecret = process.env.RAZORPAY_KEY_SECRET || 'test_secret';
      const body = orderId + '|' + paymentId;
      
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      logger.error({ error, orderId, paymentId }, 'Error verifying signature');
      return false;
    }
  }

  /**
   * Activate subscription after successful payment
   */
  async activateSubscription(
    organizationId: string,
    planId: string,
    paymentId: string,
    orderId: string,
    signature: string
  ) {
    try {
      // Verify signature
      const isValid = this.verifyPaymentSignature(orderId, paymentId, signature);
      
      if (!isValid) {
        throw new BadRequestError('Invalid payment signature');
      }

      // Find plan
      const plan = await PlanModel.findById(planId);
      if (!plan) {
        throw new NotFoundError('Plan not found');
      }

      // Calculate subscription dates
      const startDate = new Date();
      let endDate = new Date();
      
      if (plan.billingCycle === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (plan.billingCycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else if (plan.billingCycle === 'lifetime') {
        endDate.setFullYear(endDate.getFullYear() + 100); // Effectively lifetime
      }

      // Update organization subscription
      const organization = await OrganizationModel.findByIdAndUpdate(
        organizationId,
        {
          $set: {
            'subscription.planId': planId,
            'subscription.status': 'active',
            'subscription.startDate': startDate,
            'subscription.endDate': endDate,
            'subscription.razorpaySubscriptionId': paymentId,
          },
        },
        { new: true }
      );

      if (!organization) {
        throw new NotFoundError('Organization not found');
      }

      logger.info({
        organizationId,
        planId,
        paymentId,
        startDate,
        endDate,
      }, 'Subscription activated successfully');

      return {
        organization,
        subscription: {
          planId,
          planName: plan.name,
          status: 'active',
          startDate,
          endDate,
          billingCycle: plan.billingCycle,
        },
      };
    } catch (error) {
      logger.error({ error, organizationId, planId }, 'Error activating subscription');
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(organizationId: string) {
    try {
      const organization = await OrganizationModel.findByIdAndUpdate(
        organizationId,
        {
          $set: {
            'subscription.status': 'cancelled',
          },
        },
        { new: true }
      );

      if (!organization) {
        throw new NotFoundError('Organization not found');
      }

      logger.info({ organizationId }, 'Subscription cancelled');

      return organization;
    } catch (error) {
      logger.error({ error, organizationId }, 'Error cancelling subscription');
      throw error;
    }
  }

  /**
   * Get subscription details
   */
  async getSubscriptionDetails(organizationId: string) {
    try {
      const organization = await OrganizationModel.findById(organizationId)
        .populate('subscription.planId')
        .lean();

      if (!organization) {
        throw new NotFoundError('Organization not found');
      }

      return {
        subscription: organization.subscription,
        isActive: organization.subscription?.status === 'active',
      };
    } catch (error) {
      logger.error({ error, organizationId }, 'Error fetching subscription');
      throw error;
    }
  }

  /**
   * Handle Razorpay webhook
   */
  async handleWebhook(payload: any, signature: string) {
    try {
      // Verify webhook signature
      const keySecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_secret';
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(JSON.stringify(payload))
        .digest('hex');

      if (expectedSignature !== signature) {
        throw new BadRequestError('Invalid webhook signature');
      }

      const event = payload.event;
      const paymentEntity = payload.payload.payment.entity;

      logger.info({ event, paymentId: paymentEntity.id }, 'Razorpay webhook received');

      // Handle different webhook events
      switch (event) {
        case 'payment.captured':
          // Payment successful - already handled in activateSubscription
          break;
        
        case 'payment.failed':
          logger.warn({ paymentId: paymentEntity.id }, 'Payment failed');
          break;
        
        case 'subscription.cancelled':
          // Handle subscription cancellation
          break;
        
        default:
          logger.info({ event }, 'Unhandled webhook event');
      }

      return { success: true };
    } catch (error) {
      logger.error({ error, payload }, 'Error handling webhook');
      throw error;
    }
  }
}
