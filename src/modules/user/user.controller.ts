import { Request, Response } from 'express';
import { IPaginationOptions } from '../../types/pagination';
import catchAsync from '../../utils/catchAsync';
import { getPaginationOptions } from '../../utils/pagination';
import { IUserFilterableFields } from './user.interface';
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

// get all users - admin
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const filters: IUserFilterableFields = {
        searchTerm: req.query.searchTerm as string | undefined,
        role: req.query.role as string | undefined,
        status: req.query.status as string | undefined
    };

    const options: IPaginationOptions = getPaginationOptions(req);

    const result = await UserServices.getAllUsers(filters, options);

    res.status(200).json({
        success: true,
        message: 'Users fetched successfully!',
        meta: result.meta,
        data: result.data
    });
});

// Get a single user by ID
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserServices.getSingleUser(id as string);

    res.status(200).json({
        success: true,
        message: 'User retrieved successfully!',
        data: result
    });
});

// Update a single user by ID
const updateUser = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params

    const result = await UserServices.updateUser(id as string, req.body)
    
    res.status(200).json({
        success: true,
        message: 'User updated successfully!',
        data: result
    })
})

export const UserControllers = {
    getMyProfile,
    updateMyProfile,
    getAllUsers,
    getSingleUser,
    updateUser
};
