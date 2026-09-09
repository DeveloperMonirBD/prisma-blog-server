import { z } from 'zod';

// Create Post Validation (Req Body)
const createPostValidationSchema = z.object({
    body: z.object({
        title: z
            .string({
                message: 'Title is required'
            })
            .min(3, { message: 'Title must be at least 3 characters long' })
            .max(200, { message: 'Title cannot exceed 200 characters' }),

        content: z
            .string({
                message: 'Content is required'
            })
            .min(10, { message: 'Content must be at least 10 characters long' }),

        thumbnail: z.string().url({ message: 'Thumbnail must be a valid URL' }).optional(),

        isFeatured: z.boolean().optional().default(false),

        status: z
            .enum(['DRAFT', 'PUBLISHED'], {
                message: "Status must be either 'DRAFT' or 'PUBLISHED'"
            })
            .optional(),

        tags: z.array(z.string()).optional(),

        authorId: z.string({
            message: 'Author ID is required'
        })
    })
});

// Query Params Validation (For GET All Posts)
const getAllPostsQueryValidationSchema = z.object({
    query: z.object({
        searchTerm: z.string().optional(),
        status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
        isFeatured: z.enum(['true', 'false']).optional(),
        page: z.string().regex(/^\d+$/, { message: 'Page must be a positive number' }).optional(),
        limit: z.string().regex(/^\d+$/, { message: 'Limit must be a positive number' }).optional()
    })
});

// UUID Params Validation (For GET /:id, DELETE /:id)
const postIdParamValidationSchema = z.object({
    params: z.object({
        id: z
            .string({
                message: 'Post ID is required'
            })
            .uuid({ message: 'Invalid Post ID format. Must be a valid UUID.' })
    })
});

// Update Post Validation (Req Body)
const updatePostValidationSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(200).optional(),
        content: z.string().min(10).optional(),
        thumbnail: z.string().url().optional(),
        isFeatured: z.boolean().optional(),
        status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
        tags: z.array(z.string()).optional(),
        authorId: z.string().optional()
    })
});

export const PostValidations = {
    createPostValidationSchema,
    getAllPostsQueryValidationSchema,
    postIdParamValidationSchema,
    updatePostValidationSchema
};
