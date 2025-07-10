import express from "express";
import * as dc from "../controllers/directoryController";


export const directoryRoute = express.Router();

directoryRoute.get('/getUsersDirectories/', dc.getUsersDirectories);
directoryRoute.get('/getUsersDirectoriesStructured/', dc.getUsersDirectoriesStructured);
directoryRoute.put('/createDirectory', dc.createDirectory);
directoryRoute.post('/addChildren', dc.addChildrenByIds)