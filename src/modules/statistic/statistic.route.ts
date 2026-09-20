import { Router } from 'express';
import { auth } from '../../middlewares/auth';
import { StatisticControllers } from './statistic.controller';


const router = Router();

router.get(
    '/statistic',
    auth('ADMIN'),
    StatisticControllers.getStatistics
)


export const statisticRouter = router;