import { Comment as PrismaComment } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { ICreateComment } from './comment.interface';

// create comment
const createPostComment = async (
    postId: string,
    authorId: string,
    data: ICreateComment
): Promise<PrismaComment> => {
    // Check post exists
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    });

    if (!post) {
        throw new Error('Post not found!');
    }

    const result = await prisma.comment.create({
        data: {
            comment: data.comment,
            postId,
            authorId
        }
    });

    return result;
};

// create comment replay
const createPostReply = async (
    commentId: string,
    authorId: string,
    data: ICreateComment
): Promise<PrismaComment> => {
    // Find parent comment
    const parentComment = await prisma.comment.findUnique({
        where: {
            id: commentId
        }
    });

    if (!parentComment) {
        throw new Error('Parent comment not found!');
    }

    const result = await prisma.comment.create({
        data: {
            comment: data.comment,
            postId: parentComment.postId,
            authorId,
            parentId: commentId
        }
    });

    return result;
};

// get post comments
const getPostComments = async (postId: string, page: number = 1, limit: number = 10) => {
    const currentPage = Math.max(1, page);
    const currentLimit = Math.min(Math.max(1, limit), 50);

    const skip = (currentPage - 1) * currentLimit;

    const [comments, total] = await Promise.all([
        prisma.comment.findMany({
            where: {
                postId,
                parentId: null,
                status: 'APPROVED'
            },

            orderBy: {
                createdAt: 'desc'
            },

            skip,
            take: currentLimit,

            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },

                replies: {
                    where: {
                        status: 'APPROVED'
                    },

                    orderBy: {
                        createdAt: 'asc'
                    },

                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    }
                },

                _count: {
                    select: {
                        replies: {
                            where: {
                                status: 'APPROVED'
                            }
                        }
                    }
                }
            }
        }),

        prisma.comment.count({
            where: {
                postId,
                parentId: null,
                status: 'APPROVED'
            }
        })
    ]);

    const totalPages = Math.ceil(total / currentLimit);

    return {
        meta: {
            page: currentPage,
            limit: currentLimit,
            total,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1
        },
        data: comments
    };
};

export const CommentServices = {
    createPostComment,
    createPostReply,
    getPostComments
};
