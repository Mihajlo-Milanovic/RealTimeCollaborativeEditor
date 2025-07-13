import express from "express";
import * as dc from "../controllers/directoryController";
import * as validation from "../middlewares/validation/httpRequestValidation";

export const directoryRouter = express.Router();

directoryRouter.get('/getUsersDirectories/',
    validation.validateUUID(),
    dc.getUsersDirectories
);

directoryRouter.get('/getUsersDirectoriesStructured/',
    validation.validateUUID(),
    dc.getUsersDirectoriesStructured
);

directoryRouter.get('/getFilesInDirectory',
    validation.validateDirectoryId(),
    dc.getFilesInDirectory
);

directoryRouter.put('/createDirectory',
    validation.validateDirectory(),
    dc.createDirectory
);

directoryRouter.post('/addChildren', dc.addChildrenByIds);
directoryRouter.post('/addFiles', dc.addFilesByIds);
directoryRouter.delete('/deleteDirectory', dc.deleteDirectory);