import { Router } from "express";
import * as dc from "../controllers/directoryController";
import * as validation from "../middlewares/validation/httpRequestValidation";

export const directoryRouter = Router();


directoryRouter.post('/create',
    validation.validateDirectory(),
    dc.createDirectory
);

directoryRouter.delete('/:id/delete',
    validation.validateIdFromPath('id'),
    dc.deleteDirectory
);

directoryRouter.get('/:uuid/unstructured',
    validation.validateIdFromQuery('uuid'),
    dc.getUsersDirectories
);

directoryRouter.get('/:uuid/structured/',
    validation.validateIdFromQuery('uuid'),
    dc.getUsersDirectoriesStructured
);

directoryRouter.get('/:dirId/children&files',
    validation.validateIdFromQuery('dirId'),
    dc.getDirectoryWithChildrenAndFiles
);

directoryRouter.get('/:dirId/files',
    validation.validateIdFromQuery('dirId'),
    dc.getFilesInDirectory
);

directoryRouter.get('/:uuid/root',
    validation.validateIdFromQuery('uuid'),
    dc.getUserRootDirectories
);

directoryRouter.put('/:dirId/addChildren',
    validation.validateChildrenAdmission(),
    dc.addChildrenByIds
);

directoryRouter.put('/:dirId/removeChildren',
    validation.validateChildrenAdmission(),
    dc.removeFromChildrenByIds
);

directoryRouter.put('/:dirId/addFiles',
    validation.validateFilesAdmission(),
    dc.addFilesByIds
);

directoryRouter.put('/:dirId/removeFiles',
    validation.validateFilesAdmission(),
    dc.removeFromFilesByIds
);