import express from 'express';
import { PostController } from './post.controller';

const router = express.Router();

router.post('/', PostController.createPost);
router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getSinglePost);

export const postRouter = router;
