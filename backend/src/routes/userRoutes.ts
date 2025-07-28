import {Request, Response, Router} from "express";
import * as uc from "../controllers/userController";
import * as validation from "../middlewares/validation/httpRequestValidation";

export const userRouter = Router();

userRouter.all('/',
    (req: Request, res: Response) => {

    const routes: Array<string> = userRouter.stack.map(({route}) =>
        `[${[...new Set(route?.stack?.map(entry => entry.method))]}] ${route?.path}`
    );
    res.json(routes).end();
});



userRouter.get('/getUsers', uc.getUsers);

userRouter.get('/getUser',
    validation.validateId('uuid'),
    uc.getUserById
);

userRouter.get('/getUserByEmail',
    validation.validateEmail(),
    uc.getUserByEmail
);

userRouter.get('/getUserByVerificationToken',
    validation.validateToken(),
    uc.getUserByVerificationToken
);

userRouter.get('/verifyUser',
    validation.validateToken(),
    uc.verifyUser
);

userRouter.post('/createUser',
    validation.validateUser(),
    uc.createUser
);


userRouter.delete('/deleteUser',
    validation.validateId('uuid'),
    uc.deleteUserWithId)