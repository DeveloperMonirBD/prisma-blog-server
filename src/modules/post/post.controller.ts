import { Request, Response } from 'express';
import { PostStatus } from '../../../generated/prisma/client';
import { IPaginationOptions } from '../../types/pagination';
import catchAsync from '../../utils/catchAsync';
import { getPaginationOptions } from '../../utils/pagination';
import { IPostFilterableFields } from './post.interface';
import { PostServices } from './post.service';

// create post
const createPost = catchAsync(async (req: Request, res: Response) => {
    const result = await PostServices.createPost({
        ...req.body,
        authorId: req.user!.id
    });

    res.status(201).json({
        success: true,
        message: 'Post Created Successfully!',
        data: result
    });
});

// get all posts
const getAllPosts = catchAsync(async (req: Request, res: Response) => {
    const filters: IPostFilterableFields = {
        searchTerm: req.query.searchTerm as string | undefined,
        status: req.query.status as PostStatus | undefined,
        tags: req.query.tags ? (req.query.tags as string).split(',') : [],
        isFeatured: req.query.isFeatured !== undefined ? req.query.isFeatured === 'true' : undefined
    };

    const options: IPaginationOptions = getPaginationOptions(req);

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
    const result = await PostServices.updatePost(
        id as string,
        req.user!.id,
        req.user!.role,
        req.body
    );

    res.status(200).json({
        success: true,
        message: 'Post updated successfully!',
        data: result
    });
});

// delete post
const deletePost = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    await PostServices.deletePost(id as string, req.user!.id, req.user!.role);

    res.status(200).json({
        success: true,
        message: 'Post deleted successfully!',
        data: null
    });
});

// get posts by author ID
const getPostsByAuthor = catchAsync(async (req: Request, res: Response) => {
    const { authorId } = req.params;

    const result = await PostServices.getPostsByAuthor(authorId as string)

    res.status(200).json({
        success: true,
        message: 'Author Posts retrieved successfully!',
        data: result
    })
})

export const PostController = {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost,
    getPostsByAuthor
};
