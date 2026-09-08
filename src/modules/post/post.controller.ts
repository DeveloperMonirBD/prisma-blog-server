import { Request, Response } from 'express';
import { PostServices } from './post.service';

// create post
const createPost = async (req: Request, res: Response) => {
    try {
        const result = await PostServices.createPost(req.body);

        res.status(201).json({
            success: true,
            message: 'Post Created Successfully!',
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err?.message || 'Failed to create post',
            err
        });
    }
};

// get all posts
const getAllPosts = async (req: Request, res: Response) => {
    try {
        // // Query params option no: 1
        // const filters = {
        //     searchTerm: req.query.searchTerm as string,
        //     status: req.query.status as any,
        //     isFeatured: req.query.isFeatured ? req.query.isFeatured === 'true' : undefined,
        //     page: req.query.page ? Number(req.query.page) : undefined,
        //     limit: req.query.limit ? Number(req.query.limit) : undefined
        // };

        // const result = await PostServices.getAllPosts(filters);

        // Query params option no: 2
        // Filter object
        const filters = {
            searchTerm: req.query.searchTerm as string,
            status: req.query.status as any,
            isFeatured: req.query.isFeatured ? req.query.isFeatured === 'true' : undefined
        };

        // option or pagination object
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
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err?.message || 'Failed to fetch posts',
            err
        });
    }
};

// get Single Post
const getSinglePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await PostServices.getSinglePost(id as string);

        res.status(200).json({
            success: true,
            message: 'Post fetched successfully',
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err?.message || 'Failed to fetch post',
            err
        });
    }
};

// update post
const updatePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log('Updating Post ID:', id);
        console.log('Update Data:', req.body);

        const result = await PostServices.updatePost(id as string, req.body);

        res.status(200).json({
            success: true,
            message: 'Post updated successfully!',
            data: result
        });
    
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err?.message || 'Failed to update post',
            err
        });
    }
};

export const PostController = {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost
};
