import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();

// Parsers
app.use(express.json());

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Prisma Blog App Server is Running!'
    });
});

export default app;
