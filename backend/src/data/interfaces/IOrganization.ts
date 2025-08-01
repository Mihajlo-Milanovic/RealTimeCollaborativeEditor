import { Document, Types } from "mongoose";

export interface IOrganization extends Document {
    name: string;
    organizer: Types.ObjectId;
    children: Array<Types.ObjectId>;
    files: Array<Types.ObjectId>;
    members: Array<Types.ObjectId>;
    projections: Array<Types.ObjectId>;
}

export type SimpleOrganization = {
    name: string;
    organizer: string;
    children: Array<string>;
    files: Array<string>;
    members: Array<string>;
    projections: Array<string>;
}

export type OverrideType<T,U> = Pick<T, Exclude<keyof T, keyof U>> & U