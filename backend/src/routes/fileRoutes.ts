import express from "express";
import {getFile, getFilesInDirectory} from "../controllers/fileController";


export const fileRoute = express.Router();

fileRoute.get('/getFileById', getFile);
fileRoute.post('/getFilesInDirectory', getFilesInDirectory);