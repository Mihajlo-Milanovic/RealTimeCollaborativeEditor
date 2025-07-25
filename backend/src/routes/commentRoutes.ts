import { Request, Response, Router } from "express";
import * as cc from "../controllers/commentController";
import * as validation from "../middlewares/validation/httpRequestValidation";

export const commentRouter = Router();

commentRouter.all('/',
    (req: Request, res: Response) => {

        const routes: Array<string> = commentRouter.stack.map(({route}) =>
            `[${[...new Set(route?.stack?.map(entry => entry.method))]}] ${route?.path}`
        );
        res.json(routes).end();
    });

commentRouter.get('/getCommentById',
    validation.validateId('commentId'),
    cc.getCommentById
);

commentRouter.get('/getCommentsForFile',
    validation.validateId("fileId"),
    cc.getCommentsForFile
);

commentRouter.post('/createComment',
    validation.validateComment(),
    cc.createComment
);

commentRouter.put('/updateComment',
    validation.validateIdExistsInBody('commentId'),
    validation.validateCommentUpdate(),
    cc.updateComment
);

commentRouter.delete('/deleteComment',
    validation.validateId('commentId'),
    cc.deleteComment
);