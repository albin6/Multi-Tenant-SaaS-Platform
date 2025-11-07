import crypto from 'crypto';
import { OrganizationRepository } from '../repositories/organization.repository';
import { IOrganization } from '../models/organization.model';
import {
  CreateOrganizationPhase1DTO,
  CreateOrgnameDTO,
  UpdateOrganizationDTO,
} from '../dto/organization.dto';
import { BadRequestError, NotFoundError } from '@core/utils/app-error';
import { logger } from '@core/utils/logger';

/**
 * Organization Service
 * Business logic for organization management
 */
export class OrganizationService {
  private repository: OrganizationRepository;

  constructor() {
    this.repository = new OrganizationRepository();
  }

  /**
   * Phase 1: Register company and send verification email
   */
  async createOrganizationPhase1(
    data: CreateOrganizationPhase1DTO,
    ownerId: string,
    ownerEmail: string
  ): Promise<{ organization: IOrganization; verificationToken: string }> {
    try {
      // Check if user already has an organization
      const existingOrgs = await this.repository.findByOwnerId(ownerId);
      
      // Allow multiple organizations per user (change limit as needed)
      if (existingOrgs.length >= 5) {
        throw new BadRequestError(
          'Maximum number of organizations reached'
        );
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create organization
      const organization = await this.repository.createOrganization({
        ...data,
        ownerId,
        ownerEmail,
        status: 'pending_verification',
        verificationToken,
        verificationTokenExpiry,
      });

      logger.info(
        { organizationId: organization._id, ownerId },
        'Organization Phase 1 completed'
      );

      // TODO: Send verification email
      // await this.sendVerificationEmail(data.companyEmail, verificationToken);

      return {
        organization,
        verificationToken, // Return for development/testing
      };
    } catch (error) {
      logger.error({ error, ownerId }, 'Error in Phase 1');
      throw error;
    }
  }

  /**
   * Phase 2: Verify email
   */
  async verifyEmail(
    organizationId: string,
    verificationToken: string
  ): Promise<IOrganization> {
    try {
      // Find organization with verification token (includes select: false fields)
      const organization = await this.repository.findByIdWithToken(organizationId);

      if (!organization) {
        throw new NotFoundError('Organization not found');
      }

      // Check token validity
      if (
        !organization.verificationToken ||
        organization.verificationToken !== verificationToken
      ) {
        throw new BadRequestError('Invalid verification token');
      }

      if (
        organization.verificationTokenExpiry &&
        organization.verificationTokenExpiry < new Date()
      ) {
        throw new BadRequestError('Verification token expired');
      }

      // Verify email
      const verified = await this.repository.verifyEmail(organizationId);

      if (!verified) {
        throw new BadRequestError('Failed to verify email');
      }

      logger.info({ organizationId }, 'Email verified successfully');

      return verified;
    } catch (error) {
      logger.error({ error, organizationId }, 'Error verifying email');
      throw error;
    }
  }

  /**
   * Phase 3: Set orgname
   */
  async setOrgname(data: CreateOrgnameDTO): Promise<IOrganization> {
    try {
      const { organizationId, orgname } = data;

      // Find organization
      const organization = await this.repository.findById(organizationId);

      if (!organization) {
        throw new NotFoundError('Organization not found');
      }

      // Check if email is verified
      if (!organization.isEmailVerified) {
        throw new BadRequestError('Email must be verified before setting orgname');
      }

      // Check if orgname already set
      if (organization.orgname) {
        throw new BadRequestError('Orgname already set');
      }

      // Check availability
      const isAvailable = await this.repository.isOrgnameAvailable(orgname);

      if (!isAvailable) {
        throw new BadRequestError('Orgname is not available');
      }

      // Set orgname
      const updated = await this.repository.setOrgname(organizationId, orgname);

      if (!updated) {
        throw new BadRequestError('Failed to set orgname');
      }

      logger.info({ organizationId, orgname }, 'Orgname set successfully');

      return updated;
    } catch (error) {
      logger.error({ error }, 'Error setting orgname');
      throw error;
    }
  }

  /**
   * Check orgname availability (real-time check)
   */
  async checkOrgnameAvailability(orgname: string): Promise<{
    available: boolean;
    message: string;
  }> {
    try {
      // Validate format
      const orgnameRegex = /^[a-z0-9-]+$/;
      if (!orgnameRegex.test(orgname)) {
        return {
          available: false,
          message:
            'Orgname can only contain lowercase letters, numbers, and hyphens',
        };
      }

      if (orgname.length < 3) {
        return {
          available: false,
          message: 'Orgname must be at least 3 characters',
        };
      }

      if (orgname.length > 50) {
        return {
          available: false,
          message: 'Orgname must be at most 50 characters',
        };
      }

      if (orgname.startsWith('-') || orgname.endsWith('-')) {
        return {
          available: false,
          message: 'Orgname cannot start or end with a hyphen',
        };
      }

      // Reserved words
      const reserved = ['admin', 'api', 'www', 'app', 'mail', 'ftp', 'localhost'];
      if (reserved.includes(orgname)) {
        return {
          available: false,
          message: 'This orgname is reserved',
        };
      }

      // Check database
      const isAvailable = await this.repository.isOrgnameAvailable(orgname);

      return {
        available: isAvailable,
        message: isAvailable ? 'Orgname is available' : 'Orgname is already taken',
      };
    } catch (error) {
      logger.error({ error, orgname }, 'Error checking orgname availability');
      throw error;
    }
  }

  /**
   * Get organization by ID
   */
  async getOrganizationById(id: string): Promise<IOrganization> {
    const organization = await this.repository.findById(id);

    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    return organization;
  }

  /**
   * Get organization by orgname
   */
  async getOrganizationByOrgname(orgname: string): Promise<IOrganization> {
    const organization = await this.repository.findByOrgname(orgname);

    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    return organization;
  }

  /**
   * Get organizations by owner
   */
  async getOrganizationsByOwner(ownerId: string): Promise<IOrganization[]> {
    return await this.repository.findByOwnerId(ownerId);
  }

  /**
   * Update organization
   */
  async updateOrganization(
    id: string,
    ownerId: string,
    data: UpdateOrganizationDTO
  ): Promise<IOrganization> {
    // Find and verify ownership
    const organization = await this.repository.findById(id);

    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    if (organization.ownerId !== ownerId) {
      throw new BadRequestError('Not authorized to update this organization');
    }

    // Update
    const updated = await this.repository.update(id, data);

    if (!updated) {
      throw new BadRequestError('Failed to update organization');
    }

    logger.info({ organizationId: id, ownerId }, 'Organization updated');

    return updated;
  }

  /**
   * Delete organization
   */
  async deleteOrganization(id: string, ownerId: string): Promise<void> {
    // Find and verify ownership
    const organization = await this.repository.findById(id);

    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    if (organization.ownerId !== ownerId) {
      throw new BadRequestError('Not authorized to delete this organization');
    }

    await this.repository.delete(id);

    logger.info({ organizationId: id, ownerId }, 'Organization deleted');
  }

  /**
   * Check if organization has active subscription
   */
  async hasActiveSubscription(orgname: string): Promise<boolean> {
    const organization = await this.repository.findByOrgname(orgname);

    if (!organization) {
      return false;
    }

    return (
      organization.subscription?.status === 'active' &&
      organization.status === 'active'
    );
  }
}
