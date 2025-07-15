import Comment from "../models/Comment";
import File from "../models/File";
import User from "../models/User";
import {IFile} from "../interfaces/IFile";
import {IComment, SimpleComment} from "../interfaces/IComment";
import {IUser} from "../interfaces/IUser";
import {IReaction} from "../interfaces/IReaction";
import Reaction from "../models/Reaction";

export async function getCommentById(commentId: string): Promise<IComment | null> {

    return Comment.findById(commentId);
}

export async function getCommentsForFile(fileId: string): Promise<Array<IComment> | null> {

    const file: IFile | null = await File.findById(fileId);
    if (file)
        return Comment.find({ file: fileId });
    else
        return null;
}

export async function createComment(comment: SimpleComment): Promise<IComment | Error> {

    const commenter: IUser | null = await User.findById(comment.commenter);
    if(commenter == null)
        return Error("User not found!");

    const file: IFile | null = await File.findById(comment.file);
    if(file == null)
        return Error("File not found!");

    const newComment: IComment = await Comment.create(comment);

    // await newComment.populate('file');
    // if(newComment.populated('file')) {
    //     const file = newComment.file as unknown as IFile;
    //     file.comments.push(newComment);
    //     await file.save();
    // }
    return newComment;

}

export async function updateComment(comment: SimpleComment & {commentId: string}): Promise<IComment | null> {

    return Comment.findByIdAndUpdate(comment.commentId, {...comment, edited: true}, { new: true }).exec();
}

export async function deleteComment(commentId: string) {
    await Comment.findByIdAndDelete(commentId).exec();
}