import { Request, Response } from "express";
import {IComment, SimpleComment} from "../data/interfaces/IComment";
import * as cs from "../services/commentService";
import {checkForValidationErrors} from "../middlewares/validation/checkForValidationErrors";
import {matchedData} from "express-validator";

export async function getCommentById (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams: { commentId: string } = matchedData(req);
        const comment = await cs.getCommentById(queryParams.commentId);
        if (comment)
            res.status(200).json(comment).end();
        else
            res.status(404).send("Comment not found.").end();
    }
    catch (err){
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function getCommentsForFile(req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams: { fileId: string } = matchedData(req);
        const comments = await cs.getCommentsForFile(queryParams.fileId);
        if(comments != null)
            res.status(200).json(comments).end();
        else
            res.status(404).send("File not found.").end();
    }
    catch (err){
        console.error(err);
        res.status(500).send("Internal server error occurred");
    }
}

export async function createComment (req: Request, res: Response) {

    if(checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj = matchedData(req) as SimpleComment;
        const newComment = await cs.createComment(bodyObj);
        if(newComment)
            res.status(201).json(newComment).end();
        else
            res.status(404).send((newComment as Error).message).end();
    }
    catch(err) {
        console.error(err);
        res.status(500).send("Internal server error occurred!").end()
    }

}

export async function updateComment (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try{
        const bodyObj: SimpleComment & {commentId: string} = matchedData(req);
        const updatedComment = await cs.updateComment(bodyObj);
        if (updatedComment)
            res.status(200).json(updatedComment).end();
        else
            res.status(404).send("Comment not found.").end();
    }
    catch (err){
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function deleteComment (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try{
        const queryParams: {commentId: string} = matchedData(req);
        await cs.deleteComment(queryParams.commentId);
        res.status(200).send("Comment deleted successfully.").end();
    }
    catch (err){
        console.error(err);
        res.status(500).send("Internal server error occurred!").end();
    }
}
