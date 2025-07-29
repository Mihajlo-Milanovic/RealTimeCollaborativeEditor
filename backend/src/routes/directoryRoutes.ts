import {Request, Response, Router} from "express";
import * as dc from "../controllers/directoryController";
import * as validation from "../middlewares/validation/httpRequestValidation";

export const directoryRouter = Router();

directoryRouter.all('/',
    (req: Request, res: Response) => {

        const routes: Array<string> = directoryRouter.stack.map(({route}) =>
            `[${[...new Set(route?.stack?.map(entry => entry.method))]}] ${route?.path}`
        );
        res.json(routes).end();
    });

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
    dc.getDirectoryWithChildrenAndFiles
);

directoryRouter.get('/getUserRootDirectory',
    validation.validateId('uuid'),
    dc.getUserRootDirectory
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