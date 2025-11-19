import {Request, Response, Router} from "express";
import * as uc from "../controllers/userController";
import * as validation from "../middlewares/validation/httpRequestValidation";

export const userRouter = Router();

// userRouter.all('/',
//     (req: Request, res: Response) => {
//
//     const routes: Array<string> = userRouter.stack.map(({route}) =>
//         `[${[...new Set(route?.stack?.map(entry => entry.method))]}] ${route?.path}`
//     );
//     res.json(routes).end();
// });

userRouter.get('/', uc.getUsers);

userRouter.get('/:uuid',
    validation.validateId('uuid'),
    uc.getUserById
);

userRouter.get('/email/:email',
    validation.validateEmail(),
    uc.getUserByEmail
);

userRouter.get('/verificationToken/:verificationToken',
    validation.validateToken(),
    uc.getUserByVerificationToken
);

userRouter.get('/verify/:verificationToken',
    validation.validateToken(),
    uc.verifyUser
);

userRouter.post('/create',
    validation.validateUser(),
    uc.createUser
);


userRouter.delete('/delete/:uuid',
    validation.validateId('uuid'),
    uc.deleteUserWithId)