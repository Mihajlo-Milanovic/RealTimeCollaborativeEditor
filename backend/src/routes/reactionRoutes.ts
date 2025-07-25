import * as validation from "../middlewares/validation/httpRequestValidation";
import * as rc from "../controllers/reactionController";
import {Request, Response, Router} from "express";
import {validateId} from "../middlewares/validation/httpRequestValidation";

export const reactionRouter = Router();

reactionRouter.all('/',
    (req: Request, res: Response) => {

        const routes: Array<string> = reactionRouter.stack.map(({route}) =>
            `[${[...new Set(route?.stack?.map(entry => entry.method))]}] ${route?.path}`
        );
        res.json(routes).end();
    });

reactionRouter.get('/getAllReactionsForComment',
    validateId('commentId'),
    rc.getAllReactionsForComment
);

reactionRouter.put('/createOrUpdateReaction',
    validation.validateReaction(),
    rc.createOrUpdateReaction
);

reactionRouter.delete('/deleteReaction',
    validation.validateId('reactionId'),
    rc.deleteReaction
);