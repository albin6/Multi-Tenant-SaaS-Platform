import { OrganizationModel, IOrganization } from '../models/organization.model';
import { logger } from '@core/utils/logger';

/**
 * In-memory cache for orgname availability checks
 * This will dramatically improve performance for high-concurrency scenarios
 * In production, replace with Redis for distributed caching
 */
class OrgnameCache {
  private cache: Map<string, { exists: boolean; timestamp: number }>;
  private readonly TTL = 60000; // 1 minute TTL
  private readonly MAX_SIZE = 10000; // Max cache entries

  constructor() {
    this.cache = new Map();
    // Clean up expired entries periodically
    setInterval(() => this.cleanup(), 60000);
  }

  get(orgname: string): boolean | null {
    const entry = this.cache.get(orgname);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(orgname);
      return null;
    }

    return entry.exists;
  }

  set(orgname: string, exists: boolean): void {
    // Prevent cache from growing too large
    if (this.cache.size >= this.MAX_SIZE) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(orgname, {
      exists,
      timestamp: Date.now(),
    });
  }

  invalidate(orgname: string): void {
    this.cache.delete(orgname);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.TTL) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton cache instance
const orgnameCache = new OrgnameCache();

/**
 * Organization Repository
 * Handles all database operations for organizations
 */
export class OrganizationRepository {
  /**
   * Check if orgname is available (with caching)
   * Optimized for high concurrency
   */
  async isOrgnameAvailable(orgname: string): Promise<boolean> {
    try {
      // Check cache first
      const cached = orgnameCache.get(orgname);
      if (cached !== null) {
        logger.debug({ orgname, cached }, 'Orgname availability from cache');
        return !cached; // Return inverse (available = not exists)
      }

      // Query database with optimized index
      const exists = await OrganizationModel.exists({ orgname });
      const available = !exists;

      // Cache the result
      orgnameCache.set(orgname, !!exists);

      logger.debug({ orgname, available }, 'Orgname availability from DB');
      return available;
    } catch (error) {
      logger.error({ error, orgname }, 'Error checking orgname availability');
      throw error;
    }
  }

  /**
   * Create organization (Phase 1)
   */
  async createOrganization(
    data: Partial<IOrganization>
  ): Promise<IOrganization> {
    try {
      const organization = await OrganizationModel.create(data);
      logger.info({ organizationId: organization._id }, 'Organization created');
      return organization;
    } catch (error) {
      logger.error({ error }, 'Error creating organization');
      throw error;
    }
  }

  /**
   * Find organization by ID
   */
  async findById(id: string): Promise<IOrganization | null> {
    try {
      return await OrganizationModel.findById(id);
    } catch (error) {
      logger.error({ error, id }, 'Error finding organization by ID');
      throw error;
    }
  }

  /**
   * Find organization by ID with verification token (for email verification)
   */
  async findByIdWithToken(id: string): Promise<IOrganization | null> {
    try {
      return await OrganizationModel.findById(id)
        .select('+verificationToken +verificationTokenExpiry');
    } catch (error) {
      logger.error({ error, id }, 'Error finding organization with token');
      throw error;
    }
  }

  /**
   * Find organization by orgname
   */
  async findByOrgname(orgname: string): Promise<IOrganization | null> {
    try {
      return await OrganizationModel.findOne({ orgname });
    } catch (error) {
      logger.error({ error, orgname }, 'Error finding organization by orgname');
      throw error;
    }
  }

  /**
   * Find organizations by owner ID
   */
  async findByOwnerId(ownerId: string): Promise<IOrganization[]> {
    try {
      return await OrganizationModel.find({ ownerId }).sort({ createdAt: -1 });
    } catch (error) {
      logger.error({ error, ownerId }, 'Error finding organizations by owner');
      throw error;
    }
  }

  /**
   * Update organization
   */
  async update(
    id: string,
    data: Partial<IOrganization>
  ): Promise<IOrganization | null> {
    try {
      const organization = await OrganizationModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );

      // Invalidate cache if orgname changed
      if (data.orgname) {
        orgnameCache.invalidate(data.orgname);
      }

      return organization;
    } catch (error) {
      logger.error({ error, id }, 'Error updating organization');
      throw error;
    }
  }

  /**
   * Set orgname (Phase 3)
   */
  async setOrgname(id: string, orgname: string): Promise<IOrganization | null> {
    try {
      // Double-check availability before setting
      const isAvailable = await this.isOrgnameAvailable(orgname);
      if (!isAvailable) {
        throw new Error('Orgname is not available');
      }

      const organization = await OrganizationModel.findByIdAndUpdate(
        id,
        {
          $set: {
            orgname,
            status: 'active',
          },
        },
        { new: true, runValidators: true }
      );

      // Update cache
      if (organization) {
        orgnameCache.set(orgname, true);
      }

      logger.info({ organizationId: id, orgname }, 'Orgname set successfully');
      return organization;
    } catch (error) {
      logger.error({ error, id, orgname }, 'Error setting orgname');
      throw error;
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(id: string): Promise<IOrganization | null> {
    try {
      return await OrganizationModel.findByIdAndUpdate(
        id,
        {
          $set: {
            isEmailVerified: true,
            status: 'pending_orgname',
          },
          $unset: {
            verificationToken: '',
            verificationTokenExpiry: '',
          },
        },
        { new: true }
      );
    } catch (error) {
      logger.error({ error, id }, 'Error verifying email');
      throw error;
    }
  }

  /**
   * Update subscription
   */
  async updateSubscription(
    id: string,
    subscriptionData: IOrganization['subscription']
  ): Promise<IOrganization | null> {
    try {
      return await OrganizationModel.findByIdAndUpdate(
        id,
        { $set: { subscription: subscriptionData } },
        { new: true }
      );
    } catch (error) {
      logger.error({ error, id }, 'Error updating subscription');
      throw error;
    }
  }

  /**
   * Delete organization
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await OrganizationModel.findByIdAndDelete(id);
      if (result?.orgname) {
        orgnameCache.invalidate(result.orgname);
      }
      return !!result;
    } catch (error) {
      logger.error({ error, id }, 'Error deleting organization');
      throw error;
    }
  }

  /**
   * Find organizations with active subscriptions
   */
  async findActiveSubscriptions(): Promise<IOrganization[]> {
    try {
      return await OrganizationModel.find({
        'subscription.status': 'active',
        status: 'active',
      });
    } catch (error) {
      logger.error({ error }, 'Error finding active subscriptions');
      throw error;
    }
  }
}
