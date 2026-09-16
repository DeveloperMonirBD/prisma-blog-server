import { Post, Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { IPaginationOptions } from '../../types/pagination';
import { IPostFilterableFields } from './post.interface';

// create post
const createPost = async (data: Prisma.PostCreateInput): Promise<Post> => {
    // Check if there is already any post with this title
    const isPostExist = await prisma.post.findFirst({
        where: {
            title: {
                equals: data.title,
                mode: 'insensitive'
            }
        }
    });

    // If it's from a POST, then give an error instead of creating
    if (isPostExist) {
        throw new Error('A post with this title already exists!');
    }

    const result = await prisma.post.create({
        data,
        include: {
            comments: true
        }
    });
    return result;
};

// get all posts
const getAllPosts = async (filters: IPostFilterableFields, options: IPaginationOptions) => {
    const { searchTerm, status, tags, isFeatured } = filters;

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;

    const skip = (page - 1) * limit;

    const andConditions: Prisma.PostWhereInput[] = [];

    // title or content search logic
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
                {
                    content: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
                {
                    tags: {
                        has: searchTerm
                    }
                }
            ]
        });
    }

    // Filter by tags
    if (tags && tags.length > 0) {
        andConditions.push({
            tags: {
                hasEvery: tags
            }
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
            [sortBy]: sortOrder
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

// get single post
const getSinglePost = async (id: string) => {
    const result = await prisma.post.update({
        where: {
            id
        },

        // Increase view count whenever the post is viewed
        data: {
            views: {
                increment: 1
            }
        },

        include: {
            // Post author
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            },

            // Total approved main comments
            _count: {
                select: {
                    comments: {
                        where: {
                            parentId: null,
                            status: 'APPROVED'
                        }
                    }
                }
            }
        }
    });

    return result;
};

// update post
const updatePost = async (id: string, payload: Partial<Prisma.PostUpdateInput>): Promise<Post> => {
    const result = await prisma.post.update({
        where: { id },
        data: payload
    });

    return result;
};

// delete post
const deletePost = async (id: string): Promise<Post> => {
    const result = await prisma.post.delete({
        where: { id }
    });

    return result;
};

export const PostServices = {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost
};
