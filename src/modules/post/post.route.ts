import express from 'express';
import { PostController } from './post.controller';

const router = express.Router();

router.post('/', PostController.createPost);
router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getSinglePost);
router.patch('/:id', PostController.updatePost);
router.delete('/:id', PostController.deletePost);

export const postRouter = router;
