import express from "express";
import * as cc from "../controllers/commentController";


export const commentRoute = express.Router();

commentRoute.get('/getCommentById', cc.getCommentById);
commentRoute.get('/getCommentsForFile', cc.getCommentsForFile);
commentRoute.post('/createComment', cc.createComment);
commentRoute.delete('/deleteComment', cc.deleteComment);
commentRoute.put('/updateComment', cc.updateComment);