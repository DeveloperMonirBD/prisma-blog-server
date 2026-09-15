import { Request } from 'express';
import { IPaginationOptions } from '../types/pagination';



export const getPaginationOptions = (req: Request): IPaginationOptions => {
    const sortOrder: 'asc' | 'desc' = req.query.sortOrder === 'asc' ? 'asc' : 'desc';

    return {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sortBy: req.query.sortBy as string,
        sortOrder
    };
};
