import express from "express";
import * as uc from "../controllers/userController";


export const userRoute = express.Router();

// userRoute.get('/', )
userRoute.get('/getUsers', uc.getUsers);
userRoute.get('/getUser', uc.getUserById)
userRoute.post('/createUser', uc.createUser);