import {Request, Response, Router} from "express";
import * as validation from "../middlewares/validation/httpRequestValidation";
import * as fc from "../controllers/fileController";

export const fileRouter = Router();

// fileRouter.all('/',
//     (req: Request, res: Response) => {
//
//         const routes: Array<string> = fileRouter.stack.map(({route}) =>
//             `[${[...new Set(route?.stack?.map(entry => entry.method))]}] ${route?.path}`
//         );
//         res.json(routes).end();
//     });

fileRouter.put('/create',
    validation.validateFile(),
    fc.createFile
);

fileRouter.delete('/:fileId/delete',
    validation.validateId('fileId'),
    fc.deleteFile
);

fileRouter.get('/:fileId',
    validation.validateId('fileId'),
    fc.getFile
);
