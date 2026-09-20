import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { StatisticServices } from './statistic.service';

const getStatistics = catchAsync(async (_req: Request, res: Response) => {
    const result = await StatisticServices.getStatistics();

    res.status(200).json({
        success: true,
        message: 'Statistics retrieved successfully!',
        data: result
    });
});

export const StatisticControllers = {
    getStatistics
};
