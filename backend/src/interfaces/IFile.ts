import { Document, Types } from "mongoose";

export interface IFile extends Document {
    name: string;
    owner: Types.ObjectId;
    parent: Types.ObjectId;
    collaborators: Array<Types.ObjectId>;
}
