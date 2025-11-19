import { Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    verified: boolean;
    verificationToken?: string;
}

export type SimpleUser = {
    username: string;
    email: string;
    password: string;
    verified: boolean;
    verificationToken?: string;
}

export function isIUser(obj: any): obj is IUser {
    return typeof obj === "object" && obj !== null &&
        "username" in obj && typeof obj.username === "string" &&
        "email" in obj && typeof obj.email === "string" &&
        "password" in obj && typeof obj.password === "string" &&
        "verified" in obj && typeof obj.verified === "boolean";
        // && "verificationToken" in obj && typeof obj.verificationToken === "string"
}
