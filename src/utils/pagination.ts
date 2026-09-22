import { Request } from 'express';
import { IPaginationOptions } from '../types/pagination';

export const getPaginationOptions = (req: Request): IPaginationOptions => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder: 'asc' | 'desc' = req.query.sortOrder === 'asc' ? 'asc' : 'desc';

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    };
};
