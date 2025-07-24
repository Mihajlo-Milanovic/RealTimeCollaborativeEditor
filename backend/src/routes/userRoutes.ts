import express from "express";
import * as uc from "../controllers/userController";
import * as validation from "../middlewares/validation/httpRequestValidation";


export const userRouter = express.Router();


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

userRouter.post('/createUser',
    validation.validateUser(),
    uc.createUser
);

userRouter.post('/verifyUser',
    validation.validateToken(),
    uc.verifyUser
);

userRouter.delete('/deleteUser',
    validation.validateId('uuid'),
    uc.deleteUserWithId)