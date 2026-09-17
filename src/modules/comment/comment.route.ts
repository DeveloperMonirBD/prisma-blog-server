import express from 'express';
import { auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CommentControllers } from './comment.controller';
import { CommentValidations } from './comment.validation';

const router = express.Router();

// create comment
router.post(
    '/posts/:postId/comments',
    auth('ADMIN', 'USER'),
    validateRequest(CommentValidations.postIdParamValidationSchema),
    validateRequest(CommentValidations.createCommentValidationSchema),
    CommentControllers.createPostComment
);

// create replay comment
router.post(
    '/comments/:commentId/replies',
    auth('ADMIN', 'USER'),
    validateRequest(CommentValidations.commentIdParamValidationSchema),
    validateRequest(CommentValidations.createCommentValidationSchema),
    CommentControllers.createPostReply
);

// get Post comments
router.get(
    '/posts/:postId/comments',
    validateRequest(CommentValidations.postIdParamValidationSchema),
    validateRequest(CommentValidations.getPostCommentsQueryValidationSchema),
    CommentControllers.getPostComments
);

// Update Comment
router.patch(
    '/comments/:commentId',
    auth('ADMIN', 'USER'),
    validateRequest(CommentValidations.commentIdParamValidationSchema),
    validateRequest(CommentValidations.updateCommentValidationSchema),
    CommentControllers.updateComment
);

// Delete Comment
router.delete(
    '/comments/:commentId',
    auth('ADMIN', 'USER'),
    validateRequest(CommentValidations.commentIdParamValidationSchema),
    CommentControllers.deleteComment
);

// Update Comment Status — Admin
router.patch(
    '/comments/:commentId/status',
    auth('ADMIN'),
    validateRequest(CommentValidations.commentIdParamValidationSchema),
    validateRequest(CommentValidations.updateCommentStatusValidationSchema),
    CommentControllers.updateCommentStatus
);

export const CommentRouter = router;
