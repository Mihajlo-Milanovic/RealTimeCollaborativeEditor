import * as us from "../services/userService";

export const getUsers = async (req: any, res: any) => {
    const users = await us.getAllUsers();
    res.json(users);
};

export const createUser = async (req: any, res: any) => {
    const newUser = await us.createNewUser(req, res);
    res.status(201).json(newUser);
}