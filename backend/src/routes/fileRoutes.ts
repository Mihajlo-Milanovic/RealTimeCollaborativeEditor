import {Request, Response, Router} from "express";
import * as validation from "../middlewares/validation/httpRequestValidation";
import * as fc from "../controllers/fileController";
import * as cc from "../controllers/commentController";

export const fileRouter = Router();


fileRouter.post('/create',
    validation.validateFile(),
    fc.createFile
);

fileRouter.delete('/:fileId/delete',
    validation.validateIdFromQuery('fileId'),
    fc.deleteFile
);

fileRouter.get('/:fileId',
    validation.validateIdFromQuery('fileId'),
    fc.getFile
);

fileRouter.get('/:fileId/comments',
    validation.validateIdFromQuery("fileId"),
    fc.getCommentsForFile
);
