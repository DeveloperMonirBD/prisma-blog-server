import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express, { Application, type Request, type Response } from 'express';
import { auth } from './lib/auth';
import globalErrorHandler from './middlewares/globalErrorHandler';
import { PostRouter } from './modules/posts/post.route';
import { CommentRouter } from './modules/comments/comment.route';
import { statisticRouter } from './modules/statistics/statistic.route';

const app: Application = express();

// Parsers / Middlewares
app.use(express.json());
app.use(
    cors({
        origin: process.env.APP_URL || ' http://localhost:3000',
        credentials: true
    })
);

// Better Auth Route Handler
app.all('/api/auth/{*any}', toNodeHandler(auth));

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Prisma Blog App Server is Running!'
    });
});

// Application Routes
app.use('/api', PostRouter);

// Comment Routes
app.use('/api', CommentRouter);

// Statistic Routes
app.use('/api/statistics', statisticRouter);

// 404 Error handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Api Route Not Found!'
    });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
