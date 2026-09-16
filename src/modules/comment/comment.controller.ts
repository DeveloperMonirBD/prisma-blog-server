import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { CommentServices } from './comment.service';
import AppError from '../../errors/AppError';

// create comment
const createPostComment = catchAsync(async (req: Request, res: Response) => {
    const postId = req.params?.postId as string;

    if (!postId) {
        throw new AppError(400, 'Post ID is required!');
    }

    const authorId = req.user?.id as string ;

    const result = await CommentServices.createPostComment(postId, authorId, req.body);

    res.status(201).json({
        success: true,
        message: 'Comment Created Successfully!',
        data: result
    });
});

// create replay comment
const createPostReply = catchAsync(async (req: Request, res: Response) => {
    const commentId = req.params.commentId as string;

    if (!commentId) {
        throw new Error('Comment ID is required!');
    }

    const authorId = req.user?.id as string;

    const result = await CommentServices.createPostReply(commentId, authorId, req.body);

    res.status(201).json({
        success: true,
        message: 'Replay Created Successfully!',
        data: result
    });
});

// get all comments
const getPostComments = catchAsync(async (req, res) => {
    const postId = req.params?.postId as string;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await CommentServices.getPostComments(postId, page, limit);

    res.status(200).json({
        success: true,
        message: 'Comments fetched successfully!',
        meta: result.meta,
        data: result.data
    });
});

export const CommentControllers = {
    createPostComment,
    createPostReply,
    getPostComments
};
