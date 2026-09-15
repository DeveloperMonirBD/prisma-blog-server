import { Comment as PrismaComment } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { ICreateComment } from './comment.interface';

// create comment
const createComment = async (data: ICreateComment): Promise<PrismaComment> => {
    const post = await prisma.post.findUnique({
        where: {
            id: data.postId
        }
    });

    if (!post) {
        throw new Error('Post not found!');
    }

    if (data.parentId) {
        const parentComment = await prisma.comment.findUnique({
            where: {
                id: data.parentId
            }
        });

        if (!parentComment) {
            throw new Error('Parent comment not found!');
        }

        if (parentComment.postId !== data.postId) {
            throw new Error('Parent comment does not belong to this post!');
        }
    }

    const result = await prisma.comment.create({
        data
    });

    return result;
};

export const CommentServices = {
    createComment
};
