import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

const validateRequest = (schema: ZodType) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // will check req.body, req.query, req.params
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                cookies: req.cookies
            });

            next();
        } catch (err) {
            // If there's a Zod Error, it will go straight to the Global Error Handler
            next(err);
        }
    };
};

export default validateRequest;
