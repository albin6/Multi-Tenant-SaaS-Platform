import { Request, Response, NextFunction } from 'express';
import { PlanModel } from '../models/plan.model';
import { logger } from '@core/utils/logger';

/**
 * Plan Controller
 * Handles plan-related HTTP requests
 */
export class PlanController {
  /**
   * Get all active plans
   * GET /api/v1/plans
   */
  getAllPlans = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const plans = await PlanModel.find({ isActive: true }).sort({ price: 1 });

      res.status(200).json({
        success: true,
        data: plans,
      });
    } catch (error) {
      logger.error({ error }, 'Error fetching plans');
      next(error);
    }
  };

  /**
   * Get plan by ID
   * GET /api/v1/plans/:id
   */
  getPlanById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const plan = await PlanModel.findById(id);

      if (!plan) {
        res.status(404).json({
          success: false,
          message: 'Plan not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: plan,
      });
    } catch (error) {
      logger.error({ error }, 'Error fetching plan');
      next(error);
    }
  };
}
