import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { CommentServices } from './comment.service';
import AppError from '../../errors/AppError';

// create comment
const createComment = catchAsync(async (req: Request, res: Response) => {
    const postId = req.params.postId as string;

    if (!postId) {
        throw new AppError(400, 'Post ID is required!');
    }

    const authorId = req.user?.id as string ;

    const result = await CommentServices.createComment(postId, authorId, req.body);

    res.status(201).json({
        success: true,
        message: 'Comment Created Successfully!',
        data: result
    });
});

// create replay comment
const createReply = catchAsync(async (req: Request, res: Response) => {
    const commentId = req.params.commentId as string;

    if (!commentId) {
        throw new Error('Comment ID is required!');
    }

    const authorId = req.user?.id as string;

    const result = await CommentServices.createReply(commentId, authorId, req.body);

    res.status(201).json({
        success: true,
        message: 'Replay Created Successfully!',
        data: result
    });
});

export const CommentControllers = {
    createComment,
    createReply
};
