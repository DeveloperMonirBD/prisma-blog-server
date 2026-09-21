import { Prisma } from "../../../generated/prisma";


export type ICreateComment = {
    comment : string;
};

export type IUpdateContent = Partial<Prisma.CommentUpdateInput>