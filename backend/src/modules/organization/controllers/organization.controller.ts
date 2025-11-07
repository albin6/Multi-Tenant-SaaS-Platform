import { Request, Response, NextFunction } from 'express';
import { OrganizationService } from '../services/organization.service';
import { logger } from '@core/utils/logger';

/**
 * Organization Controller
 * Handles HTTP requests for organization management
 */
export class OrganizationController {
  private service: OrganizationService;

  constructor() {
    this.service = new OrganizationService();
  }

  /**
   * Phase 1: Create organization (register company)
   * POST /api/v1/organizations/phase1
   */
  createPhase1 = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.userId; // From auth middleware
      const userEmail = req.user?.email || ''; // From Clerk

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const result = await this.service.createOrganizationPhase1(
        req.body,
        userId,
        userEmail
      );

      logger.info({ userId, organizationId: result.organization._id }, 'Phase 1 completed');

      res.status(201).json({
        success: true,
        message: 'Organization created. Please verify your email.',
        data: {
          organizationId: result.organization._id,
          companyName: result.organization.companyName,
          status: result.organization.status,
          // Include token in development
          verificationToken: process.env.NODE_ENV === 'development' 
            ? result.verificationToken 
            : undefined,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Phase 2: Verify email
   * POST /api/v1/organizations/verify-email
   */
  verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { organizationId, verificationToken } = req.body;

      const organization = await this.service.verifyEmail(
        organizationId,
        verificationToken
      );

      res.status(200).json({
        success: true,
        message: 'Email verified successfully. You can now create your orgname.',
        data: {
          organizationId: organization._id,
          status: organization.status,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Phase 3: Set orgname
   * POST /api/v1/organizations/set-orgname
   */
  setOrgname = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const organization = await this.service.setOrgname(req.body);

      res.status(200).json({
        success: true,
        message: 'Orgname set successfully. Your organization is now active!',
        data: {
          organizationId: organization._id,
          orgname: organization.orgname,
          subdomainUrl: `${organization.orgname}.${process.env.BASE_URL || 'localhost:3000'}`,
          status: organization.status,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Check orgname availability
   * GET /api/v1/organizations/check-orgname/:orgname
   */
  checkOrgnameAvailability = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { orgname } = req.params;

      const result = await this.service.checkOrgnameAvailability(orgname);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get organization by ID
   * GET /api/v1/organizations/:id
   */
  getOrganizationById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const organization = await this.service.getOrganizationById(id);

      res.status(200).json({
        success: true,
        data: organization,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get organizations by owner (current user)
   * GET /api/v1/organizations/my-organizations
   */
  getMyOrganizations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const organizations = await this.service.getOrganizationsByOwner(userId);

      res.status(200).json({
        success: true,
        data: organizations,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get organization by orgname
   * GET /api/v1/organizations/by-orgname/:orgname
   */
  getOrganizationByOrgname = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { orgname } = req.params;

      const organization = await this.service.getOrganizationByOrgname(orgname);

      res.status(200).json({
        success: true,
        data: organization,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update organization
   * PUT /api/v1/organizations/:id
   */
  updateOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const organization = await this.service.updateOrganization(
        id,
        userId,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Organization updated successfully',
        data: organization,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete organization
   * DELETE /api/v1/organizations/:id
   */
  deleteOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      await this.service.deleteOrganization(id, userId);

      res.status(200).json({
        success: true,
        message: 'Organization deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Check subscription status
   * GET /api/v1/organizations/subscription-status/:orgname
   */
  checkSubscriptionStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { orgname } = req.params;

      const hasActive = await this.service.hasActiveSubscription(orgname);

      res.status(200).json({
        success: true,
        data: {
          hasActiveSubscription: hasActive,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
