import express from "express";
import * as cc from "../controllers/commentController";


export const commentRouter = express.Router();

commentRouter.get('/getCommentById', cc.getCommentById);
commentRouter.get('/getCommentsForFile', cc.getCommentsForFile);
commentRouter.post('/createComment', cc.createComment);
commentRouter.delete('/deleteComment', cc.deleteComment);
commentRouter.put('/updateComment', cc.updateComment);