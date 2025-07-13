import express from "express";
import * as uc from "../controllers/userController";


export const userRouter = express.Router();


userRouter.get('/getUsers', uc.getUsers);
userRouter.get('/getUser', uc.getUserById)
userRouter.post('/createUser', uc.createUser);