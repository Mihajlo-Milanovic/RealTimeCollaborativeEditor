import express from "express";
import * as fc from "../controllers/fileController";


export const fileRouter = express.Router();

fileRouter.get('/getFileById', fc.getFile);
fileRouter.put('/createFile', fc.createFile);
fileRouter.delete('/deleteFile', fc.deleteFile);