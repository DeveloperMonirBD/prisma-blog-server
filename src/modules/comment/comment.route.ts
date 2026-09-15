import express from 'express';
import { CommentControllers } from './comment.controller';
import { auth } from '../../middlewares/auth';

const router = express.Router();

// create comment
router.post(
    '/posts/:postId/comments',
    auth(),
    CommentControllers.createComment
);

// create replay comment
router.post(
    '/comments/:commentId/replies',
    auth(),
    CommentControllers.createReply
);

export const CommentRouter = router;