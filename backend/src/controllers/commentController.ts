import {NextFunction, Request, Response} from "express";
import {IComment, INewComment} from "../data/interfaces/IComment";
import * as cs from "../services/commentService";
import {checkForValidationErrors} from "../middlewares/validation/checkForValidationErrors";
import {matchedData} from "express-validator";
import {CommentView} from "../data/types/CommentView";
import {ReactionView} from "../data/types/ReactionView";
import {getUserRoleForFile, canPerform} from "../access/authorize";


export async function createComment (req: Request, res: Response, next: NextFunction) {

    if(checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj = matchedData(req) as INewComment;

        // Backend autoritet: uloga se razrešava iz resursa (fajla), ne od klijenta.
        const role = await getUserRoleForFile(bodyObj.file, bodyObj.commenter);
        if (!canPerform(role, "comment:add")) {
            res.status(403).json({
                success: false,
                message: "Forbidden: insufficient privileges to comment.",
            });
            return;
        }

        const result: CommentView | Error = await cs.createComment(bodyObj);

        if  (!(result instanceof Error))
                res.status(201).json({
                success: true,
                data: result,
            });
        else
            res.status(404).json({
                success: false,
                message: result.message,
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

        const result: CommentView | null = await cs.getCommentById(data.id);

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

        const result: CommentView | null = await cs.updateComment(data.id, data.content);

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

        const result: CommentView | null = await cs.deleteComment(data.id);

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

        const result: Array<ReactionView> | null = await cs.getAllReactionsForComment(data.id);

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
