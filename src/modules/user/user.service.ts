import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

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

export const UserServices = {
    getMyProfile,
    updateMyProfile
};
