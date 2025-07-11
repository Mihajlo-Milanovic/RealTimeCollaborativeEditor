import File from "../models/File";
import { Types } from "mongoose"
import {IFile} from "../interfaces/IFile";
import Comment from "../models/Comment";
import { IComment } from "../interfaces/IComment";

export async function getCommentById(commentId: string): Promise<IComment | null> {
    //if (!Types.ObjectId.isValid(commentId))  Ovo mozda dodati u buducnosti, bukvalno regex za IDjeve ako ne ispunjava formu da ne zove uopste
       // return null;
    return await Comment.findById(commentId);
}

export async function getCommentsForFile(fileId: string): Promise<IComment[]> {
    return await Comment.find({ file: fileId });
}

export async function createComment(data: IComment): Promise<IComment> {
    const comment = new Comment(data);
    return await comment.save();
}

export async function updateComment(commentId: string, data: IComment): Promise<IComment | null> {
    return await Comment.findByIdAndUpdate(commentId, data, { new: true });
}

export async function deleteComment(commentId: string): Promise<boolean> {
    const result = await Comment.findByIdAndDelete(commentId);
    
    return result !== null;
}