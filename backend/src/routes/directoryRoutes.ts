import { Router } from "express";
import * as dc from "../controllers/directoryController";
import * as validation from "../middlewares/validation/httpRequestValidation";

export const directoryRouter = Router();

directoryRouter.get('/getUsersDirectories/',
    validation.validateId('uuid'),
    dc.getUsersDirectories
);

directoryRouter.get('/getUsersDirectoriesStructured/',
    validation.validateId('uuid'),
    dc.getUsersDirectoriesStructured
);

directoryRouter.get('/getChildrenAndFilesForDirectory',
    validation.validateId('dirId'),
    dc.getChildrenAndFilesForDirectory
);

directoryRouter.get('/getFilesInDirectory',
    validation.validateId('dirId'),
    dc.getFilesInDirectory
);

directoryRouter.post('/createDirectory',
    validation.validateDirectory(),
    dc.createDirectory
);

directoryRouter.put('/addChildren',
    validation.validateChildrenAdmission(),
    dc.addChildrenByIds
);

directoryRouter.put('/removeChildren',
    validation.validateChildrenAdmission(),
    dc.removeFromChildrenByIds
);

directoryRouter.put('/addFiles',
    validation.validateFilesAdmission(),
    dc.addFilesByIds
);

directoryRouter.put('/removeFiles',
    validation.validateFilesAdmission(),
    dc.removeFromFilesByIds
);

directoryRouter.delete('/deleteDirectory',
    validation.validateId('dirId'),
    dc.deleteDirectory
);