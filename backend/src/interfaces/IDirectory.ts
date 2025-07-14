import { Document, Types } from "mongoose";

export interface IDirectory extends Document {
    name: string;
    owner: Types.ObjectId;
    parent: Types.ObjectId | null;
    children: Array<Types.ObjectId>;
    files: Array<Types.ObjectId>;
    collaborators: Array<Types.ObjectId>;
    createdAt: Date;
}