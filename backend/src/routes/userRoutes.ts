import express from "express";
import * as uc from "../controllers/userController";
import * as validation from "../middlewares/validation/httpRequestValidation";


export const userRouter = express.Router();


userRouter.get('/getUsers', uc.getUsers);

userRouter.get('/getUser',
    validation.validateId('uuid'),
    uc.getUserById
);

userRouter.post('/createUser',
    validation.validateUser(),
    uc.createUser
);

userRouter.delete('/deleteUser',
    validation.validateId('uuid'),
    uc.deleteUserWithId)