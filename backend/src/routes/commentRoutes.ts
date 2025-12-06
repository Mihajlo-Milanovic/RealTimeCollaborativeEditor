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

commentRouter.post('/create',
    validation.validateComment(),
    cc.createComment
);

commentRouter.delete('/:commentId/delete',
    validation.validateId('commentId'),
    cc.deleteComment
);

commentRouter.get('/:commentId',
    validation.validateId('commentId'),
    cc.getCommentById
);

commentRouter.put('/:commentId/update',
    validation.validateCommentUpdate(),
    cc.updateComment
);