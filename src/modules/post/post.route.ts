import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PostController } from './post.controller';
import { PostValidations } from './post.validation';

const router = express.Router();

// Create Post (Body Validate)
router.post(
    '/',
    validateRequest(PostValidations.createPostValidationSchema),
    PostController.createPost
);

// Get All Posts (Query Params Validate)
router.get(
    '/',
    validateRequest(PostValidations.getAllPostsQueryValidationSchema),
    PostController.getAllPosts
);

// Get Single Post (UUID Validate)
router.get(
    '/:id',
    validateRequest(PostValidations.postIdParamValidationSchema),
    PostController.getSinglePost
);

// Update Post (Params UUID & Body Validate)
router.patch(
    '/:id',
    validateRequest(PostValidations.postIdParamValidationSchema),
    validateRequest(PostValidations.updatePostValidationSchema),
    PostController.updatePost
);

// Delete Post (UUID Validate)
router.delete(
    '/:id',
    validateRequest(PostValidations.postIdParamValidationSchema),
    PostController.deletePost
);

export const postRouter = router;
