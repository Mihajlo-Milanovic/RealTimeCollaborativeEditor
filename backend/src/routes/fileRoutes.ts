import express from "express";
import * as fc from "../controllers/fileController";


export const fileRoute = express.Router();

fileRoute.get('/getFileById', fc.getFile);
fileRoute.post('/getFilesInDirectory', fc.getFilesInDirectory);
fileRoute.put('/createFile', fc.createFile);