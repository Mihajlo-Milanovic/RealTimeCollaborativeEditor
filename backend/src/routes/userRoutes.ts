import express from "express";
import * as uc from "../controllers/userController";


export const userRoute = express.Router();

userRoute.get('/getUsers', uc.getUsers);
userRoute.post('/createUser', uc.createUser);