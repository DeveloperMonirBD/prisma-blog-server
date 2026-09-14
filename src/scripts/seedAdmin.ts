import AppError from '../errors/AppError';
import { auth as betterAuth } from '../lib/auth';
import { prisma } from '../lib/prisma';
import catchAsync from '../utils/catchAsync';

const seedAdmin = catchAsync(async (req, res) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        throw new AppError(500, 'ADMIN_EMAIL and ADMIN_PASSWORD are required');
    }

    const existingAdmin = await prisma.user.findUnique({
        where: {
            email: adminEmail
        }
    });

    if (existingAdmin) {
        throw new AppError(409, 'Admin user already exists');
    }

    const response = await betterAuth.api.signUpEmail({
        body: {
            name: 'Admin',
            email: adminEmail,
            password: adminPassword
        }
    });

    if (!response.user) {
        throw new AppError(500, 'Failed to create admin user');
    }

    await prisma.user.update({
        where: {
            id: response.user.id
        },
        data: {
            role: 'ADMIN',
            status: 'ACTIVE',
            emailVerified: true
        }
    });

    res.status(201).json({
        success: true,
        message: 'Admin created successfully'
    });
});

export default seedAdmin;
