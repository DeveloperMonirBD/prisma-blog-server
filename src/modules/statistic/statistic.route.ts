import { Router } from 'express';
import { auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StatisticControllers } from './statistic.controller';
import { statisticValidations } from './statistic.validation';

const router = Router();

router.get(
    '/statistic',
    auth('ADMIN'),
    validateRequest(statisticValidations.statisticsQueryValidationSchema),
    StatisticControllers.getStatistics
);

export const statisticRouter = router;
