import { Post, Prisma } from '../../../generated/prisma/client';
import AppError from '../../errors/AppError';
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

    const { page, limit, skip, sortBy, sortOrder } = options;

    const andConditions: Prisma.PostWhereInput[] = [];

    // title, content or tags search logic
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

    const totalPages = Math.ceil(total / limit);

    return {
        meta: {
            page,
            limit,
            total,
            totalPages
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
const updatePost = async (
    id: string,
    userId: string,
    userRole: string,
    payload: Partial<Prisma.PostUpdateInput>
): Promise<Post> => {
    const existingPost = await prisma.post.findUnique({
        where: { id }
    });

    if (!existingPost) {
        throw new AppError(404, 'Post not found');
    }

    // USER can only update their own post
    if (existingPost.authorId !== userId && userRole !== 'ADMIN') {
        throw new AppError(403, 'You are not authorized to update this post');
    }

    // USER cannot update isFeatured
    if (userRole !== 'ADMIN' && payload.isFeatured !== undefined) {
        throw new AppError(403, 'Only admin can update featured status');
    }

    // post data update checked
    const hasChanges = Object.entries(payload).some(
        ([key, value]) => existingPost[key as keyof typeof existingPost] !== value
    );

    if (!hasChanges) {
        throw new AppError(400, 'No changes detected. Post data is already up to date.');
    }

    const result = await prisma.post.update({
        where: { id },
        data: payload
    });

    return result;
};

// delete post
const deletePost = async (id: string, userId: string, userRole: string): Promise<Post> => {
    const existingPost = await prisma.post.findUnique({
        where: { id }
    });

    if (!existingPost) {
        throw new AppError(404, 'Post not found');
    }

    if (existingPost.authorId !== userId && userRole !== 'ADMIN') {
        throw new AppError(403, 'You are not authorized to delete this post');
    }

    const result = await prisma.post.delete({
        where: { id }
    });

    return result;
};

// get posts by author id
const getPostsByAuthor = async (authorId: string) => {
    const author = await prisma.user.findUnique({
        where: {
            id: authorId
        },
        select: {
            id: true,
            name: true,
            image: true
        }
    });

    if (!author) {
        throw new AppError(404, 'Author not found');
    }

    const posts = await prisma.post.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            },
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

    return posts;
};

export const PostServices = {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost,
    getPostsByAuthor
};
