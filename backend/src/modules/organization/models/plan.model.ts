import mongoose, { Schema, Document } from 'mongoose';

/**
 * Plan Document Interface
 */
export interface IPlan extends Document {
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  limits: {
    users?: number;
    storage?: number; // in GB
    apiCalls?: number; // per month
    customDomain?: boolean;
  };
  razorpayPlanId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Plan Schema
 */
const planSchema = new Schema<IPlan>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
      uppercase: true,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly', 'lifetime'],
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    limits: {
      users: {
        type: Number,
        default: 10,
      },
      storage: {
        type: Number,
        default: 5, // 5 GB
      },
      apiCalls: {
        type: Number,
        default: 10000,
      },
      customDomain: {
        type: Boolean,
        default: false,
      },
    },
    razorpayPlanId: {
      type: String,
      unique: true,
      sparse: true, // Allow null values
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PlanModel = mongoose.model<IPlan>('Plan', planSchema);
