import { Prisma } from '../../../generated/prisma';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { IPaginationOptions } from '../../types/pagination';
import { IUserFilterableFields, IUserUpdate } from './user.interface';

// get my profile
const getMyProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            phone: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if (!user) {
        throw new AppError(404, 'user not found');
    }

    return user;
};

//update my profile
const updateMyProfile = async (
    userId: string,
    payload: {
        name?: string;
        image?: string;
        phone?: string;
    }
) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!existingUser) {
        throw new AppError(404, 'User not found');
    }

    const result = await prisma.user.update({
        where: {
            id: userId
        },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            phone: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return result;
};

// get all users - admin
const getAllUsers = async (filters: IUserFilterableFields, options: IPaginationOptions) => {
    const { searchTerm, role, status } = filters;

    const { page, limit, skip, sortBy, sortOrder } = options;

    const andConditions: Prisma.UserWhereInput[] = [];

    // search by name or email
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
                {
                    email: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                }
            ]
        });
    }

    // search by role
    if (role) {
        andConditions.push({
            role
        });
    }

    // filter by status
    if (status) {
        andConditions.push({
            status
        });
    }

    const whereConditions: Prisma.UserWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder
            },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                image: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        }),

        prisma.user.count({
            where: whereConditions
        })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        meta: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        },
        data: users
    };
};

// Get a single user by ID
const getSingleUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            phone: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,

            _count: {
                select: {
                    posts: true,
                    comments: true
                }
            }
        }
    });

    if (!user) {
        throw new AppError(404, 'User not found');
    }

    return user;
};

// Update a single user by ID
const updateUser = async (userId: string, payload: IUserUpdate) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!existingUser) {
        throw new AppError(404, 'User not found');
    }

    // existing data checked
    const hasChanges = Object.entries(payload).some(
        ([key, value]) => existingUser[key as keyof typeof existingUser] !== value
    );

    if (!hasChanges) {
        throw new AppError(400, 'No changes detected. User data is already up to date.');
    }

    const result = await prisma.user.update({
        where: {
            id: userId
        },

        data: payload,

        // Return only the fields we want in the response
        select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            phone: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return result;
};

// Delete a single user by ID
const deleteUser = async (userId: string) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!existingUser) {
        throw new AppError(404, 'User not found');
    }

    await prisma.user.delete({
        where: {
            id: userId
        }
    });
};

export const UserServices = {
    getMyProfile,
    updateMyProfile,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
};
