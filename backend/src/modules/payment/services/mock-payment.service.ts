import { OrganizationModel } from '@modules/organization/models/organization.model';
import { PlanModel } from '@modules/organization/models/plan.model';
import { logger } from '@core/utils/logger';
import { NotFoundError } from '@core/utils/app-error';

/**
 * Mock Payment Service
 * For development/testing without real Razorpay credentials
 */
export class MockPaymentService {
  /**
   * Create a mock order
   */
  async createOrder(planId: string, organizationId: string) {
    try {
      const plan = await PlanModel.findById(planId);
      if (!plan) {
        throw new NotFoundError('Plan not found');
      }

      const organization = await OrganizationModel.findById(organizationId);
      if (!organization) {
        throw new NotFoundError('Organization not found');
      }

      // Generate mock order ID
      const mockOrderId = `order_mock_${Date.now()}`;

      logger.info(
        {
          orderId: mockOrderId,
          organizationId,
          planId,
          amount: plan.price,
        },
        'Mock order created'
      );

      return {
        orderId: mockOrderId,
        amount: plan.price * 100,
        currency: plan.currency,
        planName: plan.name,
        planPrice: plan.price,
      };
    } catch (error) {
      logger.error({ error, planId, organizationId }, 'Error creating mock order');
      throw error;
    }
  }

  /**
   * Verify mock payment and activate subscription
   */
  async verifyPayment(
    organizationId: string,
    planId: string,
    paymentId: string,
    orderId: string
  ) {
    try {
      // Mock verification always succeeds
      logger.info({ organizationId, planId, paymentId, orderId }, 'Mock payment verified');

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
      } else {
        endDate.setFullYear(endDate.getFullYear() + 100); // lifetime
      }

      // Update organization with subscription
      const organization = await OrganizationModel.findByIdAndUpdate(
        organizationId,
        {
          subscription: {
            planId,
            status: 'active',
            startDate,
            endDate,
            paymentId: `pay_mock_${Date.now()}`,
            orderId,
          },
          status: 'active',
        },
        { new: true }
      );

      if (!organization) {
        throw new NotFoundError('Organization not found');
      }

      logger.info(
        {
          organizationId,
          planId,
          status: 'active',
        },
        'Mock subscription activated'
      );

      return {
        success: true,
        subscription: organization.subscription,
        organization: {
          id: organization._id,
          orgname: organization.orgname,
          status: organization.status,
        },
      };
    } catch (error) {
      logger.error({ error, organizationId, planId }, 'Error verifying mock payment');
      throw error;
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(organizationId: string) {
    try {
      const organization = await OrganizationModel.findById(organizationId)
        .populate('subscription.planId')
        .lean();

      if (!organization) {
        throw new NotFoundError('Organization not found');
      }

      return {
        subscription: organization.subscription,
        organization: {
          id: organization._id,
          orgname: organization.orgname,
          status: organization.status,
        },
      };
    } catch (error) {
      logger.error({ error, organizationId }, 'Error fetching subscription');
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
          'subscription.status': 'cancelled',
          status: 'inactive',
        },
        { new: true }
      );

      if (!organization) {
        throw new NotFoundError('Organization not found');
      }

      logger.info({ organizationId }, 'Mock subscription cancelled');

      return {
        success: true,
        subscription: organization.subscription,
      };
    } catch (error) {
      logger.error({ error, organizationId }, 'Error cancelling subscription');
      throw error;
    }
  }

  /**
   * Activate subscription (alias for verifyPayment for compatibility)
   */
  async activateSubscription(
    organizationId: string,
    planId: string,
    paymentDetails: any
  ) {
    return this.verifyPayment(
      organizationId,
      planId,
      paymentDetails.paymentId || `pay_mock_${Date.now()}`,
      paymentDetails.orderId || `order_mock_${Date.now()}`
    );
  }

  /**
   * Get subscription details (alias for getSubscription for compatibility)
   */
  async getSubscriptionDetails(organizationId: string) {
    return this.getSubscription(organizationId);
  }

  /**
   * Handle webhook (no-op for mock service)
   */
  async handleWebhook(payload: any, signature: string) {
    logger.info({ payload, signature }, 'Mock webhook received (ignored)');
    return {
      success: true,
      message: 'Mock webhook handled',
    };
  }
}
