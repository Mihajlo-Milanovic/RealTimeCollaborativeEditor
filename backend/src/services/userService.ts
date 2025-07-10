import User from "../models/User";
import {IUser} from "../interfaces/IUser";


export const getAllUsers = async (): Promise<Array<IUser>> => {
    return User.find();
};

export const createNewUser = async (req: any, res: any): Promise<IUser> => {
    //todo: validation of data and error handling
    return User.create(req.body);
}