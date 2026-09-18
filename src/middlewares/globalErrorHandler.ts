// src/app/middlewares/globalErrorHandler.ts

import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { Prisma } from '../../generated/prisma/client';
import AppError from '../errors/AppError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = 500;

    let message = err?.message || 'Something went wrong!';

    let errorSources: Array<{
        path: string;
        message: string;
    }> = [];

    // ==============================
    // Custom AppError
    // ==============================
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;

        errorSources = [
            {
                path: '',
                message: err.message
            }
        ];
    }

    // ==============================
    // Zod Validation Error
    // ==============================
    if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Validation Error';

        errorSources = err.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message
        }));
    }

    // ==============================
    // Prisma Known Request Errors
    // ==============================
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique Constraint Violation - P2002
        if (err.code === 'P2002') {
            statusCode = 409;

            const target = err.meta?.target;

            const fieldName = Array.isArray(target) ? target.join(', ') : 'field';

            message = 'Duplicate Entry';

            errorSources = [
                {
                    path: fieldName,
                    message: `This ${fieldName} is already taken.`
                }
            ];
        }

        // Record Not Found - P2025
        else if (err.code === 'P2025') {
            statusCode = 404;

            message = 'Resource Not Found';

            errorSources = [
                {
                    path: '',
                    message: 'The requested resource was not found.'
                }
            ];
        }
    }

    // ==============================
    // Generic Error
    // ==============================
    else if (err instanceof Error) {
        errorSources = [
            {
                path: '',
                message: err.message
            }
        ];
    }

    // ==============================
    // Final Response
    // ==============================
    res.status(statusCode).json({
        success: false,
        message,
        errorSources: errorSources.length > 0 ? errorSources : null,
        stack: process.env.NODE_ENV === 'development' ? err?.stack : null
    });
};

export default globalErrorHandler;
