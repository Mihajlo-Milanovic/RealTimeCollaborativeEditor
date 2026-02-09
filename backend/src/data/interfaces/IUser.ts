import {Document, Types} from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    verified: boolean;
    verificationToken?: string;
}

export interface INewUser {
    username: string;
    email: string;
    password: string;
}