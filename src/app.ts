import cors from 'cors';
import express, { Application, type Request, type Response } from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import { postRouter } from './modules/post/post.route';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';

const app: Application = express();

// Parsers / Middlewares
app.use(express.json());
app.use(cors());

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
app.use('/posts', postRouter);

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
