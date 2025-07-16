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
    uc.getUserByEmail
);

userRouter.get('/getUserByVerificationToken',
    uc.getUserByVerificationToken
);

userRouter.post('/createUser',
    // !!! za sad
    //validation.validateUser(),
    uc.createUser
);

userRouter.get('/verifyUser',
    uc.verifyUser
);

userRouter.delete('/deleteUser',
    validation.validateId('uuid'),
    uc.deleteUserWithId)