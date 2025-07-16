import { Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    verified: boolean;
    verificationToken?: string;

    // avatar?: string;
}
