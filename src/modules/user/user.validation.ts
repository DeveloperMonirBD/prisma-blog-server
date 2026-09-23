import { z } from 'zod';

// User ID param validation
const userIdParamValidationSchema = z.object({
    params: z.object({
        id: z
            .string({
                message: 'User ID is required'
            })
            .uuid({
                message: 'Invalid User ID format. Must be a valid UUID.'
            })
    })
});

// Update my profile validation
const updateMyProfileValidationSchema = z.object({
    body: z
        .object({
            name: z
                .string({
                    message: 'Name is required'
                })
                .trim()
                .min(2, {
                    message: 'Name must be at least 2 characters long'
                })
                .max(100, {
                    message: 'Name cannot exceed 100 characters'
                })
                .optional(),

            image: z
                .string({
                    message: 'Image must be a string'
                })
                .url({
                    message: 'Image must be a valid URL'
                })
                .optional(),

            phone: z
                .string({
                    message: 'Phone number is required'
                })
                .trim()
                .min(10, {
                    message: 'Phone number must be at least 10 characters long'
                })
                .max(20, {
                    message: 'Phone number cannot exceed 20 characters'
                })
                .optional()
        })
        .strict()
});

// Admin update user validation
const updateUserValidationSchema = z.object({
    body: z
        .object({
            name: z
                .string({
                    message: 'Name is required'
                })
                .trim()
                .min(2, {
                    message: 'Name must be at least 2 characters long'
                })
                .max(100, {
                    message: 'Name cannot exceed 100 characters'
                })
                .optional(),

            image: z
                .string({
                    message: 'Image must be a string'
                })
                .url({
                    message: 'Image must be a valid URL'
                })
                .optional(),

            phone: z
                .string({
                    message: 'Phone number is required'
                })
                .trim()
                .min(10, {
                    message: 'Phone number must be at least 10 characters long'
                })
                .max(20, {
                    message: 'Phone number cannot exceed 20 characters'
                })
                .optional(),

            role: z
                .enum(['ADMIN', 'USER'], {
                    message: "Role must be either 'ADMIN' or 'USER'"
                })
                .optional(),

            status: z
                .enum(['ACTIVE', 'INACTIVE'], {
                    message: "Status must be either 'ACTIVE' or 'INACTIVE'"
                })
                .optional()
        })
        .strict()
});

export const UserValidations = {
    userIdParamValidationSchema,
    updateMyProfileValidationSchema,
    updateUserValidationSchema
};
