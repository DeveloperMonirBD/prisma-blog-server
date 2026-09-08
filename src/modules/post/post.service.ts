import { Post, PostStatus, Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

// create post
const createPost = async (data: Prisma.PostCreateInput): Promise<Post> => {
    const result = await prisma.post.create({
        data,
        include: {
            comments: true
        }
    });
    return result;
};

//get all posts
const getAllPosts = async (filters: {
    searchTerm?: string | undefined;
    status?: PostStatus | undefined;
    isFeatured?: boolean | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}) => {
    const { searchTerm, status, isFeatured, page = 1, limit = 10 } = filters;

    const skip = (page - 1) * limit;
    const andConditions: Prisma.PostWhereInput[] = [];

    // title or content search logice
    if (searchTerm) {
        andConditions.push({
            OR: [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { content: { contains: searchTerm, mode: 'insensitive' } }
            ]
        });
    }

    // Filter by status
    if (status) {
        andConditions.push({ status });
    }

    // Filter by Featured
    if (isFeatured !== undefined) {
        andConditions.push({ isFeatured });
    }

    const whereConditions: Prisma.PostWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    // database Query
    const result = await prisma.post.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            _count: {
                select: { comments: true }
            }
        }
    });

    const total = await prisma.post.count({
        where: whereConditions
    });

    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit)
        },
        data: result
    };
};

export const PostServices = {
    createPost,
    getAllPosts
};
