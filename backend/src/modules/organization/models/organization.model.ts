import mongoose, { Schema, Document } from 'mongoose';

/**
 * Organization Document Interface
 */
export interface IOrganization extends Document {
  orgname?: string; // Optional, set in Phase 3
  companyName: string;
  companyEmail: string;
  companyAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  ownerId: string; // Clerk user ID
  ownerEmail?: string; // Optional, derived from user
  isEmailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  status: 'pending_verification' | 'pending_orgname' | 'active' | 'suspended';
  subscription?: {
    planId: mongoose.Types.ObjectId;
    status: 'active' | 'inactive' | 'cancelled' | 'expired';
    startDate?: Date;
    endDate?: Date;
    razorpaySubscriptionId?: string;
  };
  metadata: {
    logo?: string;
    description?: string;
    website?: string;
    industry?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Organization Schema
 * Optimized for high-performance queries with proper indexing
 */
const organizationSchema = new Schema<IOrganization>(
  {
    orgname: {
      type: String,
      required: false, // Optional initially, set in Phase 3
      unique: true,
      sparse: true, // Allows multiple null values but enforces uniqueness when present
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      match: /^[a-z0-9-]+$/, // Only lowercase alphanumeric and hyphens
      index: true, // Index for fast lookups
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    companyEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    companyAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    ownerId: {
      type: String,
      required: true,
      index: true, // Index for fast owner lookups
    },
    ownerEmail: {
      type: String,
      required: false, // Optional, derived from user
      lowercase: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false, // Don't return in queries by default
    },
    verificationTokenExpiry: {
      type: Date,
      select: false,
    },
    status: {
      type: String,
      enum: ['pending_verification', 'pending_orgname', 'active', 'suspended'],
      default: 'pending_verification',
      index: true,
    },
    subscription: {
      planId: {
        type: Schema.Types.ObjectId,
        ref: 'Plan',
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled', 'expired'],
        default: 'inactive',
      },
      startDate: Date,
      endDate: Date,
      razorpaySubscriptionId: String,
    },
    metadata: {
      logo: String,
      description: String,
      website: String,
      industry: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for owner and status queries
organizationSchema.index({ ownerId: 1, status: 1 });

// Index for subscription queries
organizationSchema.index({ 'subscription.status': 1 });

// Virtual for subdomain URL
organizationSchema.virtual('subdomainUrl').get(function () {
  const baseUrl = process.env.BASE_URL || 'localhost:3000';
  return `${this.orgname}.${baseUrl}`;
});

// Pre-save hook to ensure orgname uniqueness
organizationSchema.pre('save', async function (next) {
  if (this.isModified('orgname')) {
    // Additional validation
    const exists = await mongoose.models.Organization.findOne({
      orgname: this.orgname,
      _id: { $ne: this._id },
    });
    
    if (exists) {
      throw new Error('Organization name already exists');
    }
  }
  next();
});

export const OrganizationModel = mongoose.model<IOrganization>(
  'Organization',
  organizationSchema
);

export {};
