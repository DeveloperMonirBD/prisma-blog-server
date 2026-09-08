import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { PostServices } from './post.service';

// create post
const createPost = catchAsync(async (req: Request, res: Response) => {
    const result = await PostServices.createPost(req.body);

    res.status(201).json({
        success: true,
        message: 'Post Created Successfully!',
        data: result
    });
});

// get all posts
const getAllPosts = catchAsync(async (req: Request, res: Response) => {
    const filters = {
        searchTerm: req.query.searchTerm as string,
        status: req.query.status as any,
        isFeatured: req.query.isFeatured ? req.query.isFeatured === 'true' : undefined
    };

    const options = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined
    };

    const result = await PostServices.getAllPosts(filters, options);

    res.status(200).json({
        success: true,
        message: 'Posts fetched successfully!',
        meta: result.meta,
        data: result.data
    });
});

// get Single Post
const getSinglePost = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PostServices.getSinglePost(id as string);

    res.status(200).json({
        success: true,
        message: 'Post fetched successfully!',
        data: result
    });
});

// update post
const updatePost = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PostServices.updatePost(id as string, req.body);

    res.status(200).json({
        success: true,
        message: 'Post updated successfully!',
        data: result
    });
});

// delete post
const deletePost = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await PostServices.deletePost(id as string);

    res.status(200).json({
        success: true,
        message: 'Post deleted successfully!',
        data: null
    });
});

export const PostController = {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost
};
