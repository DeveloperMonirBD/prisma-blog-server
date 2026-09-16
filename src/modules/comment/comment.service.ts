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

    // if (data.parentId) {
    //     const parentComment = await prisma.comment.findUnique({
    //         where: {
    //             id: data.parentId
    //         }
    //     });

    //     if (!parentComment) {
    //         throw new Error('Parent comment not found!');
    //     }

    //     if (parentComment.postId !== data.postId) {
    //         throw new Error('Parent comment does not belong to this post!');
    //     }
    // }

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
    const skip = (page - 1) * limit;

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
            take: limit,

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
                        replies: true
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

    const totalPages = Math.ceil(total / limit);

    return {
        meta: {
            page,
            limit,
            total,
            totalPages
        },
        data: comments
    };
};

export const CommentServices = {
    createPostComment,
    createPostReply,
    getPostComments
};
