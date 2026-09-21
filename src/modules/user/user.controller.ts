import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';

// get my profile
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.getMyProfile(req.user!.id);

    res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully!',
        data: result
    });
});

// update my profile
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.updateMyProfile(req.user!.id, req.body);

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully!',
        data: result
    });
});

export const UserControllers = {
    getMyProfile,
    updateMyProfile
};
