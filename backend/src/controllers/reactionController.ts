import {Request, Response} from "express";
import {checkForValidationErrors} from "../middlewares/validation/checkForValidationErrors";
import {matchedData} from "express-validator";
import * as rs from "../services/reactionService";
import { SimpleReaction } from "../interfaces/IReaction";


export async function getAllReactionsForComment(req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try{
        const queryParams: {commentId: string} = matchedData(req);
        const reactions = await rs.getAllReactionsForComment(queryParams.commentId);
        if (reactions)
            res.status(200).send(reactions).end();
        else
            res.status(404).send("Comment not found.").end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function createOrUpdateReaction(req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj = matchedData(req) as SimpleReaction;

        let reaction = await rs.getReactionByCommentAndUser(bodyObj.reactor, bodyObj.comment);

        if (reaction) {
            reaction.reactionType = bodyObj.reactionType;
            reaction = await rs.updateReaction(reaction);
            if (reaction)
                res.status(200).json(reaction).end();
            else
                res.status(404).send("Reaction not found.").end();
        }
        else {
            reaction = await rs.createNewReaction(bodyObj);
            if (reaction)
                res.status(201).json(reaction).end();
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function deleteReaction(req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams: {reactionId: string} = matchedData(req);
        const reaction = await rs.deleteReaction(queryParams.reactionId);
        if(reaction)
            res.status(200).send("Reaction deleted successfully.").end();
        else
            res.status(404).send("Reaction not found.").end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}