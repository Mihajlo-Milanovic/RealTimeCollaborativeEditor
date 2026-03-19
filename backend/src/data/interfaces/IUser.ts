import {Document, Types} from "mongoose";
import {UserPrivileges} from "../types/UserPrivileges";

export interface IUser extends Document {
    _id: Types.ObjectId;
    id: string;
    username: string;
    email: string;
    password: string;
    verified: boolean;
    verificationToken?: string;
    organizations: Map<string, UserPrivileges>;
}

export interface INewUser {
    username: string;
    email: string;
    password: string;
}