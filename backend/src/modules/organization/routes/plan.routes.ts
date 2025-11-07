import { Router } from 'express';
import { PlanController } from '../controllers/plan.controller';

const router = Router();
const controller = new PlanController();

/**
 * Get all active plans
 * Public endpoint
 */
router.get('/', controller.getAllPlans);

/**
 * Get plan by ID
 * Public endpoint
 */
router.get('/:id', controller.getPlanById);

export default router;
