import { Document, Types } from "mongoose";

export interface IOrganization extends Document {
    name: string;
    creator: Types.ObjectId;
    children: Array<Types.ObjectId>;
    collaborators: Array<Types.ObjectId>;
}
