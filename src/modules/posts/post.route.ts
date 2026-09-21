import express from 'express';
import { auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PostController } from './post.controller';
import { PostValidations } from './post.validation';

const router = express.Router();

// Create Post (Body Validate)
router.post(
    '/posts',
    auth('ADMIN', 'USER'),
    validateRequest(PostValidations.createPostValidationSchema),
    PostController.createPost
);

// Get All Posts (Query Params Validate)
router.get(
    '/posts',
    validateRequest(PostValidations.getAllPostsQueryValidationSchema),
    PostController.getAllPosts
);

// Get Single Post (UUID Validate)
router.get(
    '/posts/:id',
    validateRequest(PostValidations.postIdParamValidationSchema),
    PostController.getSinglePost
);

// Update Post (Params UUID & Body Validate)
router.patch(
    '/posts/:id',
    auth('ADMIN', 'USER'),
    validateRequest(PostValidations.postIdParamValidationSchema),
    validateRequest(PostValidations.updatePostValidationSchema),
    PostController.updatePost
);

// Delete Post (UUID Validate)
router.delete(
    '/posts/:id',
    auth('ADMIN', 'USER'),
    validateRequest(PostValidations.postIdParamValidationSchema),
    PostController.deletePost
);

// get post by authorId
router.get(
    '/posts/author/:authorId',
    validateRequest(PostValidations.authorIdParamValidationSchema),
    PostController.getPostsByAuthor
)

export const PostRouter = router;
