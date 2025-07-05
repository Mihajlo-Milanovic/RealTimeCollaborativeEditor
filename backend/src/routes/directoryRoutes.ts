import express from "express";
import {getUsersDirectories, getUsersDirectoriesStructured} from "../controllers/directoryController";


export const directoryRoute = express.Router();

directoryRoute.get('/getUsersDirectories/', getUsersDirectories);
directoryRoute.get('/getUsersDirectoriesStructured/', getUsersDirectoriesStructured);