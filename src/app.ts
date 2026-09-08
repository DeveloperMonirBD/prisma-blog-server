import express, { type Express, type Request, type Response } from 'express';
import { postRouter } from './modules/post/post.route';

const app: Express = express();

// Parsers
app.use(express.json());

app.use('/posts', postRouter);

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Prisma Blog App Server is Running!'
    });
});

export default app;
