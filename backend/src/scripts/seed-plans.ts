import mongoose from 'mongoose';
import { PlanModel } from '../modules/organization/models/plan.model';
import { appConfig } from '../core/config/env.config';
import { logger } from '../core/utils/logger';

/**
 * Seed Plans Script
 * Populates the database with default subscription plans
 */

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small teams and startups',
    price: 999,
    currency: 'INR',
    billingCycle: 'monthly',
    features: [
      'Up to 10 users',
      '5 GB storage',
      '10,000 API calls/month',
      'Email support',
      'Basic analytics',
    ],
    limits: {
      users: 10,
      storage: 5,
      apiCalls: 10000,
      customDomain: false,
    },
    isActive: true,
  },
  {
    name: 'Professional',
    description: 'For growing businesses that need more',
    price: 2999,
    currency: 'INR',
    billingCycle: 'monthly',
    features: [
      'Up to 50 users',
      '50 GB storage',
      '100,000 API calls/month',
      'Priority email support',
      'Advanced analytics',
      'Custom domain',
      'API access',
    ],
    limits: {
      users: 50,
      storage: 50,
      apiCalls: 100000,
      customDomain: true,
    },
    isActive: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with advanced needs',
    price: 9999,
    currency: 'INR',
    billingCycle: 'monthly',
    features: [
      'Unlimited users',
      '500 GB storage',
      'Unlimited API calls',
      '24/7 phone & email support',
      'Advanced analytics & reporting',
      'Custom domain',
      'Full API access',
      'SLA guarantee',
      'Dedicated account manager',
      'Custom integrations',
    ],
    limits: {
      users: 999999,
      storage: 500,
      apiCalls: 999999999,
      customDomain: true,
    },
    isActive: true,
  },
  {
    name: 'Yearly Starter',
    description: 'Starter plan with yearly billing (2 months free)',
    price: 9990,
    currency: 'INR',
    billingCycle: 'yearly',
    features: [
      'Up to 10 users',
      '5 GB storage',
      '10,000 API calls/month',
      'Email support',
      'Basic analytics',
      'Save 2 months (20% off)',
    ],
    limits: {
      users: 10,
      storage: 5,
      apiCalls: 10000,
      customDomain: false,
    },
    isActive: true,
  },
  {
    name: 'Yearly Professional',
    description: 'Professional plan with yearly billing (2 months free)',
    price: 29990,
    currency: 'INR',
    billingCycle: 'yearly',
    features: [
      'Up to 50 users',
      '50 GB storage',
      '100,000 API calls/month',
      'Priority email support',
      'Advanced analytics',
      'Custom domain',
      'API access',
      'Save 2 months (20% off)',
    ],
    limits: {
      users: 50,
      storage: 50,
      apiCalls: 100000,
      customDomain: true,
    },
    isActive: true,
  },
];

async function seedPlans() {
  try {
    // Connect to MongoDB
    await mongoose.connect(appConfig.database.uri);
    logger.info('Connected to MongoDB');

    // Clear existing plans (optional - comment out to keep existing)
    // await PlanModel.deleteMany({});
    // logger.info('Cleared existing plans');

    // Check if plans already exist
    const existingPlans = await PlanModel.countDocuments();
    if (existingPlans > 0) {
      logger.info(`${existingPlans} plans already exist. Skipping seed.`);
      await mongoose.disconnect();
      return;
    }

    // Insert plans
    const createdPlans = await PlanModel.insertMany(plans);
    logger.info(`Successfully seeded ${createdPlans.length} plans`);

    // Display created plans
    createdPlans.forEach((plan) => {
      logger.info(`- ${plan.name}: ₹${plan.price}/${plan.billingCycle}`);
    });

    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error seeding plans');
    process.exit(1);
  }
}

// Run the seed function
seedPlans();
