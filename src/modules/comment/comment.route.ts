import express from 'express';
import { auth } from '../../middlewares/auth';
import { CommentControllers } from './comment.controller';

const router = express.Router();

// create comment
router.post(
    '/posts/:postId/comments',
    auth('ADMIN', 'USER'),
    CommentControllers.createPostComment
);

// create replay comment
router.post(
    '/comments/:commentId/replies',
    auth('ADMIN', 'USER'),
    CommentControllers.createPostReply
);

// get all comments
router.get(
    '/posts/:postId/comments',
    CommentControllers.getPostComments
);

export const CommentRouter = router;