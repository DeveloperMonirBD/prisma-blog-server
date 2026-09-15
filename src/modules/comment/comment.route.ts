import express from 'express';
import { CommentControllers } from './comment.controller';

const router = express.Router();

// create comment
router.post('/', CommentControllers.createComment)

export const CommentRouter = router;