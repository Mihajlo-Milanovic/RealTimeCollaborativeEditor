import * as validation from "../middlewares/validation/httpRequestValidation";
import * as rc from "../controllers/reactionController";
import express from "express";
import {validateId} from "../middlewares/validation/httpRequestValidation";


export const reactionRouter = express.Router();


reactionRouter.get('/getAllReactionsForComment',
    validateId('commentId'),
    rc.getAllReactionsForComment
);

reactionRouter.put('/createOrUpdateReaction',
    validation.validateReaction(),
    rc.createOrUpdateReaction
);

reactionRouter.delete('/deleteReaction',
    validation.validateId('reactionId'),
    rc.deleteReaction
);