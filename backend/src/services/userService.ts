import User from "../models/User";


export const getAllUsers = async () => {
    return User.find();
};

export const createNewUser = async (req: any, res: any) => {
    return User.create(req.body);
}