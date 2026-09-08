// src/app/middlewares/globalErrorHandler.ts
import { ErrorRequestHandler } from 'express';
import { Prisma } from '../../generated/prisma/client';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = err?.message || 'Something went wrong!';
    let errorSources: Array<{ path: string; message: string }> = [];

    // ১. Prisma Known Request Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique Constraint Violation (P2002)
        if (err.code === 'P2002') {
            statusCode = 400;
            const target = (err.meta?.target as string[]) || [];
            const fieldName = Array.isArray(target) ? target.join(', ') : 'field';

            message = `Duplicate Entry: A post with this ${fieldName} already exists!`;
            errorSources = [
                {
                    path: fieldName,
                    message: `This ${fieldName} is already taken.`
                }
            ];
        }
        // Record Not Found Error (P2025)
        else if (err.code === 'P2025') {
            statusCode = 404;
            message = 'Post Not Found!';
            errorSources = [
                {
                    path: 'id',
                    message: 'No post found with the provided ID.'
                }
            ];
        }
    }
    // ২. General Generic Error
    else if (err instanceof Error) {
        errorSources = [
            {
                path: '',
                message: err.message
            }
        ];
    }

    // Standard API Response Structure
    res.status(statusCode).json({
        success: false,
        message,
        errorSources: errorSources.length > 0 ? errorSources : null,
        stack: process.env.NODE_ENV === 'development' ? err?.stack : null
    });
};

export default globalErrorHandler;
