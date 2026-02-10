import {NextFunction, Request, Response} from "express";
import {IComment, INewComment} from "../data/interfaces/IComment";
import * as cs from "../services/commentService";
import {checkForValidationErrors} from "../middlewares/validation/checkForValidationErrors";
import {matchedData} from "express-validator";


export async function createComment (req: Request, res: Response, next: NextFunction) {

    if(checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj = matchedData(req) as INewComment;

        const result = await cs.createComment(bodyObj);

        if (result instanceof Error)
            res.status(404).json({
                success: false,
                message: result.message,
            });
        else
            res.status(201).json({
                success: true,
                data: result,
            });
    }
    catch(err) {
        next(err);
    }
}

export async function getCommentById (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: { id: string } = matchedData(req);

        const result = await cs.getCommentById(data.id);

        if (result != null)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(404).json({
                success: false,
                message: "Comment not found.",
            });
    }
    catch (err) {
        next(err);
    }
}

export async function updateComment (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try{
        const data: {id: string, content: string} = matchedData(req);

        const result = await cs.updateComment(data.id, data.content);

        if (result != null)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(404).json({
                success: false,
                message: "Comment not found.",
            });
    }
    catch (err){
        next(err);
    }
}

export async function deleteComment (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try{
        const data: {id: string} = matchedData(req);

        const result = await cs.deleteComment(data.id);

        if (result != null)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(404).json({
                success: false,
                message: "Comment not found.",
            });
    }
    catch (err){
       next(err);
    }
}

export async function getAllReactionsForComment(req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try{
        const data: {id: string} = matchedData(req);

        const result = await cs.getAllReactionsForComment(data.id);

        if (result != null)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(404).json({
                success: false,
                message: "Comment not found.",
            });
    }
    catch (err) {
        next(err);
    }
}
