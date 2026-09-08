import { PostStatus } from '../../../generated/prisma/client';

export interface IPostFilterableFields {
    searchTerm?: string | undefined;
    status?: PostStatus | undefined;
    isFeatured?: boolean | undefined;
}

export interface IPaginationOptions {
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: 'asc' | 'desc' | undefined;
}
