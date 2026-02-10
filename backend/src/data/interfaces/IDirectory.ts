import { Document, Types } from "mongoose";
import {SimpleFile} from "./IFile";

export interface IDirectory extends Document {
    name: string;
    owner: Types.ObjectId;
    parents: Array<Types.ObjectId>;
    children: Array<Types.ObjectId>;
    files: Array<Types.ObjectId>;
    // collaborators: Array<Types.ObjectId>;
}

export type SimpleDirectory = {
    name: string;
    owner: string;
    parents: Array<string>;
    children: Array<string>;
    files: Array<string>;
    // collaborators: Array<string>;
}