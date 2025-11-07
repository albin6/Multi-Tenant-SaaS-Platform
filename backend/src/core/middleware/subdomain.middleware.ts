import { Request, Response, NextFunction } from 'express';
import { OrganizationModel } from '@modules/organization/models/organization.model';
import { logger } from '@core/utils/logger';

/**
 * Extended Request with organization context
 */
declare global {
  namespace Express {
    interface Request {
      organization?: {
        id: string;
        orgname: string;
        ownerId: string;
        hasActiveSubscription: boolean;
      };
      isSubdomain?: boolean;
      subdomain?: string;
    }
  }
}

/**
 * Extract subdomain from host header
 */
const getSubdomain = (host: string | undefined): string | null => {
  if (!host) return null;

  // Remove port if present
  const cleanHost = host.split(':')[0];
  const parts = cleanHost.split('.');

  // For localhost development: orgname.localhost
  if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
    const subdomain = parts[0];
    if (subdomain && subdomain !== 'www') {
      return subdomain;
    }
    return null;
  }

  // For production: orgname.yourdomain.com
  if (parts.length >= 3) {
    const subdomain = parts[0];
    if (subdomain && subdomain !== 'www') {
      return subdomain;
    }
  }

  return null;
};

/**
 * Subdomain Detection Middleware
 * Detects if request is from a subdomain and validates organization
 */
export const subdomainDetection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Skip subdomain detection for utility endpoints
    const skipPaths = ['/health', '/api'];
    if (skipPaths.some(path => req.path.startsWith(path))) {
      req.isSubdomain = false;
      return next();
    }

    const host = req.get('host');
    const subdomain = getSubdomain(host);

    if (!subdomain) {
      // Not a subdomain request, proceed normally
      req.isSubdomain = false;
      return next();
    }

    // This is a subdomain request
    req.isSubdomain = true;
    req.subdomain = subdomain;

    // Find organization by orgname
    const organization = await OrganizationModel.findOne({
      orgname: subdomain,
      status: 'active',
    }).lean();

    if (!organization) {
      res.status(404).json({
        status: 'error',
        message: 'Organization not found',
        statusCode: 404,
      });
      return;
    }

    // Check subscription status
    const hasActiveSubscription =
      organization.subscription?.status === 'active' &&
      organization.status === 'active';

    // Attach organization context to request
    req.organization = {
      id: organization._id.toString(),
      orgname: organization.orgname || '',
      ownerId: organization.ownerId || '',
      hasActiveSubscription,
    };

    logger.info({
      subdomain,
      organizationId: organization._id,
      hasActiveSubscription,
    }, 'Subdomain request detected');

    next();
  } catch (error) {
    logger.error({ error, host: req.get('host') }, 'Subdomain detection error');
    next(error);
  }
};

/**
 * Subscription Gate Middleware
 * Ensures organization has active subscription before accessing subdomain
 */
export const requireActiveSubscription = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.isSubdomain) {
    return next();
  }

  if (!req.organization) {
    res.status(404).json({
      status: 'error',
      message: 'Organization not found',
      statusCode: 404,
    });
    return;
  }

  if (!req.organization.hasActiveSubscription) {
    res.status(402).json({
      status: 'error',
      message: 'Active subscription required',
      statusCode: 402,
      data: {
        orgname: req.organization.orgname,
        redirectTo: '/pricing',
      },
    });
    return;
  }

  next();
};

/**
 * Organization Owner Check Middleware
 * Ensures the authenticated user is the owner of the organization
 */
export const requireOrganizationOwner = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.isSubdomain || !req.organization) {
    res.status(400).json({
      status: 'error',
      message: 'Not a subdomain request',
      statusCode: 400,
    });
    return;
  }

  const userId = req.userId; // From auth middleware

  if (!userId) {
    res.status(401).json({
      status: 'error',
      message: 'Authentication required',
      statusCode: 401,
    });
    return;
  }

  if (userId !== req.organization.ownerId) {
    res.status(403).json({
      status: 'error',
      message: 'Access denied. Organization owner only.',
      statusCode: 403,
    });
    return;
  }

  next();
};

export {};
