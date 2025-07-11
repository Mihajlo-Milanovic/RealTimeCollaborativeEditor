import express from "express";
import * as fc from "../controllers/fileController";


export const fileRoute = express.Router();

fileRoute.get('/getFileById', fc.getFile);
fileRoute.put('/createFile', fc.createFile);
fileRoute.delete('/deleteFile', fc.deleteFile);