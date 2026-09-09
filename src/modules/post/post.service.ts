import { Post, Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { IPaginationOptions, IPostFilterableFields } from './post.interface';

// create post
const createPost = async (data: Prisma.PostCreateInput): Promise<Post> => {
    // Check if there is already any post with this title
    const isPostExist = await prisma.post.findFirst({
        where: {
            title: data.title
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

//get all posts
const getAllPosts = async (
    // // Option no:1
    //     filters:{
    //     searchTerm?: string | undefined;
    //     status?: PostStatus | undefined;
    //     isFeatured?: boolean | undefined;
    //     page?: number | undefined;
    //     limit?: number | undefined;
    //  }

    // Option no:2
    filters: IPostFilterableFields,
    options: IPaginationOptions
) => {
    // // Option no:1
    // const { searchTerm, status, isFeatured, page = 1, limit = 10 } = filters;

    // Option no:2
    const { searchTerm, status, isFeatured } = filters;
    const { page = 1, limit = 10 } = options;

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

// get single post
const getSinglePost = async (id: string): Promise<Post | null> => {
    // Increase the view count by 1 as soon as the post is seen
    const result = await prisma.post.update({
        where: { id },
        data: {
            views: {
                increment: 1
            }
        },
        include: {
            comments: {
                where: { parentId: null }, // Will only bring the main comments
                include: {
                    replies: true // Will bring the replies to the main comment along
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
    console.log(result);

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
