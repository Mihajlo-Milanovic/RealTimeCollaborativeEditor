import { IComment } from "../interfaces/IComment";
import * as cs from "../services/commentService";

export const createComment = async (req: any, res: any) => {
    const result = await cs.createComment(req.body);
    res.status(200).json(result);
};

export const getCommentById = async (req: any, res: any) => {
    const commentId: string = req.query[`commentId`];
    const comment: IComment | null = await cs.getCommentById(commentId);
    res.status(200).json(comment);
};

export const getCommentsForFile = async (req: any, res: any) => {
    const fileId: string = req.query[`fileId`];
    const comments: Array<IComment> = await cs.getCommentsForFile(fileId);
    res.status(200).json(comments);
};

export const updateComment = async (req: any, res: any) => {
    const commentId: string = req.query[`commentId`];
    const updated = await cs.updateComment(commentId, req.body);
    res.status(200).json(updated);
};

export const deleteComment = async (req: any, res: any) => {
    const commentId: string = req.query[`commentId`];
    const success = await cs.deleteComment(commentId);
    if (!success) return res.status(404).json({ message: "Komentar nije pronadjen." });
    res.status(200).json({ message: "Komentar obrisan uspesno." });
};
