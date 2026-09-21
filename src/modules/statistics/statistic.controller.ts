import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { StatisticServices } from './statistic.service';

// Statistics Overview
const getStatisticsOverview = catchAsync(async (req: Request, res: Response) => {
    const result = await StatisticServices.getStatisticsOverview();

    res.status(200).json({
        success: true,
        message: 'Statistic overview retrieved successfully!',
        data: result
    });
});

// Statistics Growth
const getStatisticsGrowth = catchAsync(async (req: Request, res: Response) => {
    const result = await StatisticServices.getStatisticsGrowth();

    res.status(200).json({
        success: true,
        message: 'Statistics growth retrieved successfully!',
        data: result
    });
});

// Top Content
const getTopContent = catchAsync(async (req: Request, res: Response) => {
    const result = await StatisticServices.getTopContent();

    res.status(200).json({
        success: true,
        message: 'Top content retrieved successfully!',
        data: result
    });
});

export const StatisticControllers = {
    getStatisticsOverview,
    getStatisticsGrowth,
    getTopContent
};
