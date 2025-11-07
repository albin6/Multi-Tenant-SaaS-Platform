import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { authenticate, optionalAuthenticate } from '@core/middleware/auth.middleware';
import { validate } from '@core/middleware/validation.middleware';
import {
  createOrganizationPhase1Schema,
  verifyOrganizationEmailSchema,
  createOrgnameSchema,
  checkOrgnameAvailabilitySchema,
  updateOrganizationSchema,
} from '../dto/organization.dto';

const router = Router();
const controller = new OrganizationController();

/**
 * Phase 1: Create organization (register company)
 * Requires authentication
 */
router.post(
  '/phase1',
  authenticate,
  validate(createOrganizationPhase1Schema, 'body'),
  controller.createPhase1
);

/**
 * Phase 2: Verify email
 * Public endpoint (token-based verification)
 */
router.post(
  '/verify-email',
  validate(verifyOrganizationEmailSchema, 'body'),
  controller.verifyEmail
);

/**
 * Phase 3: Set orgname
 * Requires authentication (to prevent abuse)
 */
router.post(
  '/set-orgname',
  authenticate,
  validate(createOrgnameSchema, 'body'),
  controller.setOrgname
);

/**
 * Check orgname availability (real-time check)
 * Public endpoint for UX (rate-limited via middleware if needed)
 */
router.get(
  '/check-orgname/:orgname',
  validate(checkOrgnameAvailabilitySchema, 'params'),
  controller.checkOrgnameAvailability
);

/**
 * Get current user's organizations
 * Requires authentication
 */
router.get(
  '/my-organizations',
  authenticate,
  controller.getMyOrganizations
);

/**
 * Get organization by ID
 * Requires authentication
 */
router.get(
  '/:id',
  authenticate,
  controller.getOrganizationById
);

/**
 * Get organization by orgname
 * Optional authentication (public info but authenticated gets more details)
 */
router.get(
  '/by-orgname/:orgname',
  optionalAuthenticate,
  controller.getOrganizationByOrgname
);

/**
 * Update organization
 * Requires authentication and ownership
 */
router.put(
  '/:id',
  authenticate,
  validate(updateOrganizationSchema, 'body'),
  controller.updateOrganization
);

/**
 * Delete organization
 * Requires authentication and ownership
 */
router.delete(
  '/:id',
  authenticate,
  controller.deleteOrganization
);

/**
 * Check subscription status
 * Public endpoint (used by subdomain middleware)
 */
router.get(
  '/subscription-status/:orgname',
  controller.checkSubscriptionStatus
);

export default router;
