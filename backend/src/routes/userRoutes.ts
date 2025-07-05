import express from "express";
import {createUser, getUsers} from "../controllers/userController";


export const userRoute = express.Router();

userRoute.get('/getUsers', getUsers);
userRoute.post('/createUser', createUser);