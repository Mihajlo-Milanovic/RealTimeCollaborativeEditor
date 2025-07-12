import express from "express";
import * as validator from "express-validator";
import * as dc from "../controllers/directoryController";

export const directoryRoute = express.Router();

directoryRoute.get('/getUsersDirectories/',
    validator.query('uuid', "Invalid uuid!")
        .notEmpty().bail().withMessage("Field 'uuid' is missing!")
        .isMongoId().bail(),
    dc.getUsersDirectories
);


directoryRoute.get('/getUsersDirectoriesStructured/', dc.getUsersDirectoriesStructured);
directoryRoute.post('/getFilesInDirectory', dc.getFilesInDirectory);
directoryRoute.put('/createDirectory', dc.createDirectory);
directoryRoute.post('/addChildren', dc.addChildrenByIds);
directoryRoute.post('/addFiles', dc.addFilesByIds);
directoryRoute.delete('/deleteDirectory', dc.deleteDirectory);