import {Request, Response, Router} from "express";
import * as fc from "../controllers/fileController";

export const fileRouter = Router();

fileRouter.all('/',
    (req: Request, res: Response) => {

        const routes: Array<string> = fileRouter.stack.map(({route}) =>
            `[${[...new Set(route?.stack?.map(entry => entry.method))]}] ${route?.path}`
        );
        res.json(routes).end();
    });

fileRouter.get('/getFileById', fc.getFile);
fileRouter.put('/createFile', fc.createFile);
fileRouter.delete('/deleteFile', fc.deleteFile);