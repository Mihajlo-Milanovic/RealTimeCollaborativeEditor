import User from "../models/User";
import {IUser} from "../interfaces/IUser";


export async function getAllUsers(): Promise<Array<IUser>> {
    return User.find();
}

export async function getUserById(uuid: string): Promise<IUser | null> {

    return User.findById(uuid);
}

export async function createNewUser(req: any, res: any): Promise<IUser> {
    //todo: validation of data and error handling
    return User.create(req.body);
}