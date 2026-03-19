import {Request, Response, Router} from "express";
import * as uc from "../controllers/userController";
import * as validation from "../middlewares/validation/httpRequestValidation";

export const userRouter = Router();

userRouter.post('/create',
    validation.validateUser(),
    uc.createUser
);

userRouter.delete('/:id/delete',
    validation.validateIdFromPath('id'),
    uc.deleteUserWithId
);

userRouter.get('/',
    validation.validateUserIdArray(),
    uc.getUsersByIds
);

userRouter.get('/:id',
    validation.validateIdFromPath('id'),
    uc.getUserById
);

userRouter.get('/:id/password',
    validation.validateIdFromPath('id'),
    uc.getUsersPasswordHash
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

userRouter.get('/:id/organizations',
    validation.validateIdFromPath('id'),
    uc.getOrganizationsForUser
);