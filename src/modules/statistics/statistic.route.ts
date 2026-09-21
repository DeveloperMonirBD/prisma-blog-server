import { Router } from 'express';
import { auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StatisticControllers } from './statistic.controller';
import { statisticValidations } from './statistic.validation';

const router = Router();

// Statistics Overview
router.get(
    '/overview',
    auth('ADMIN'),
    validateRequest(statisticValidations.statisticsQueryValidationSchema),
    StatisticControllers.getStatisticsOverview
);

//statistics Grouth
router.get(
    '/growth',
    auth('ADMIN'),
    validateRequest(statisticValidations.statisticsQueryValidationSchema),
    StatisticControllers.getStatisticsGrowth
);

// Top Content
router.get(
    '/top-content',
    auth('ADMIN'),
    validateRequest(statisticValidations.statisticsQueryValidationSchema),
    StatisticControllers.getTopContent
);

export const statisticRouter = router;
