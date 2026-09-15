import { PostStatus } from '../../../generated/prisma/client';

export interface IPostFilterableFields {
    searchTerm?: string | undefined;
    status?: PostStatus | undefined;
    tags?: string[] | undefined;
    isFeatured?: boolean | undefined;
}

export interface IPaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: 'title' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
