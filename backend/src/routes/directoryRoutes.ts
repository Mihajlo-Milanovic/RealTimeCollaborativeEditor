import { Router } from "express";
import * as dc from "../controllers/directoryController";
import * as validation from "../middlewares/validation/httpRequestValidation";

export const directoryRouter = Router();

// directoryRouter.all('/',
//     (req: Request, res: Response) => {
//
//         const routes: Array<string> = directoryRouter.stack.map(({route}) =>
//             `[${[...new Set(route?.stack?.map(entry => entry.method))]}] ${route?.path}`
//         );
//         res.json(routes).end();
//     });


directoryRouter.post('/create',
    validation.validateDirectory(),
    dc.createDirectory
);

directoryRouter.delete('/:dirId/delete',
    validation.validateId('dirId'),
    dc.deleteDirectory
);

directoryRouter.get('/:uuid/unstructured',
    validation.validateId('uuid'),
    dc.getUsersDirectories
);

directoryRouter.get('/:uuid/structured/',
    validation.validateId('uuid'),
    dc.getUsersDirectoriesStructured
);

directoryRouter.get('/:dirId/children&files',
    validation.validateId('dirId'),
    dc.getDirectoryWithChildrenAndFiles
);

directoryRouter.get('/:dirId/files',
    validation.validateId('dirId'),
    dc.getFilesInDirectory
);

directoryRouter.get('/:uuid/root',
    validation.validateId('uuid'),
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