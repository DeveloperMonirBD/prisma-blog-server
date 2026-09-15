import { Comment as PrismaComment } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { ICreateComment } from './comment.interface';

// create comment
const createComment = async (
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
const createReply = async (
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

export const CommentServices = {
    createComment,
    createReply
};
