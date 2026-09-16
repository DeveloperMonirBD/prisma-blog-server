import { z } from 'zod';

// Create Comment / Reply Validation
const createCommentValidationSchema = z.object({
    body: z.object({
        comment: z
            .string({
                message: 'Comment is required'
            })
            .trim()
            .min(1, {
                message: 'Comment cannot be empty'
            })
            .max(1000, {
                message: 'Comment cannot exceed 1000 characters'
            }),

        parentId: z
            .string()
            .uuid({
                message: 'Invalid parent comment ID format. Must be a valid UUID.'
            })
            .optional()
            .nullable()
    })
});

// Get Post Comments Query Validation
const getPostCommentsQueryValidationSchema = z.object({
    query: z.object({
        page: z
            .string()
            .regex(/^\d+$/, {
                message: 'Page must be a positive number'
            })
            .optional(),

        limit: z
            .string()
            .regex(/^\d+$/, {
                message: 'Limit must be a positive number'
            })
            .optional()
    })
});

// Post ID Params Validation
const postIdParamValidationSchema = z.object({
    params: z.object({
        postId: z
            .string({
                message: 'Post ID is required'
            })
            .uuid({
                message: 'Invalid Post ID format. Must be a valid UUID.'
            })
    })
});

// Comment ID Params Validation
const commentIdParamValidationSchema = z.object({
    params: z.object({
        id: z
            .string({
                message: 'Comment ID is required'
            })
            .uuid({
                message: 'Invalid Comment ID format. Must be a valid UUID.'
            })
    })
});

// Update Comment Validation
const updateCommentValidationSchema = z.object({
    body: z.object({
        comment: z
            .string({
                message: 'Comment is required'
            })
            .trim()
            .min(1, {
                message: 'Comment cannot be empty'
            })
            .max(1000, {
                message: 'Comment cannot exceed 1000 characters'
            })
    })
});

// Update Comment Status Validation
const updateCommentStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum(['PENDING', 'APPROVED', 'REJECTED'], {
            message: "Status must be either 'PENDING', 'APPROVED' or 'REJECTED'"
        })
    })
});

export const CommentValidations = {
    createCommentValidationSchema,
    getPostCommentsQueryValidationSchema,
    postIdParamValidationSchema,
    commentIdParamValidationSchema,
    updateCommentValidationSchema,
    updateCommentStatusValidationSchema
};
