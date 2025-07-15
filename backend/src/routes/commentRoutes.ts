import express from "express";
import * as cc from "../controllers/commentController";
import * as validation from "../middlewares/validation/httpRequestValidation";


export const commentRouter = express.Router();

commentRouter.get('/getCommentById',
    validation.validateId('commentId'),
    cc.getCommentById
);

commentRouter.get('/getCommentsForFile',
    validation.validateId("fileId"),
    cc.getCommentsForFile
);

commentRouter.post('/createComment',
    validation.validateComment(),
    cc.createComment
);

commentRouter.put('/updateComment',
    validation.validateIdExistsInBody('commentId'),
    validation.validateCommentUpdate(),
    cc.updateComment
);

commentRouter.delete('/deleteComment',
    validation.validateId('commentId'),
    cc.deleteComment
);