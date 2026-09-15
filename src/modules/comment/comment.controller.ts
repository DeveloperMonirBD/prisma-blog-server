import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { CommentServices } from "./comment.service";


const createComment = catchAsync(async (req: Request, res: Response) => {

    const result = await CommentServices.createComment(req.body)

    res.status(201).json({
        success: true,
        message: 'Comment Created Successfully!',
        data: result
    })
})

export const CommentControllers = {
    createComment
};