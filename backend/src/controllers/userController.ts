import * as us from "../services/userService";
import {IUser} from "../interfaces/IUser";

export async function getUsers(req: any, res: any) {

    const users = await us.getAllUsers();
    res.json(users);
}

export async function getUserById(req: any, res: any) {

     const user = await us.getUserById(req.query['uuid']);
     res.status(200).json(user);
}

export async function createUser(req: any, res: any) {

    const newUser = await us.createNewUser(req, res);
    res.status(201).json(newUser);
}