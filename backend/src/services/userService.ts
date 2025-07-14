import User from "../models/User";
import {IUser} from "../interfaces/IUser";


export async function getAllUsers(): Promise<Array<IUser>> {
    return User.find();
}

export async function getUserById(uuid: string): Promise<IUser | null> {
    return User.findById(uuid);
}

export async function getUserWithUsername(username: string): Promise<IUser | null> {
    return User.findOne({username: username});
}

export async function getUserWithEmail(email: string): Promise<IUser | null> {
    return User.findOne({email: email});
}

export async function createNewUser(user: IUser): Promise<IUser> {
    return User.create(user);
}

export async function deleteUserWithId(uuid: string) {
    await User.findByIdAndDelete(uuid).exec();
}