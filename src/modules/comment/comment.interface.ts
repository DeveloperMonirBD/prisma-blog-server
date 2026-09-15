import { Prisma } from "../../../generated/prisma";


export type ICreateComment = {
    comment : string;
    // postId: string;
    // authorId: string;
    // parentId?: string | null;
};

export type IUpdateContent = Partial<Prisma.CommentUpdateInput>