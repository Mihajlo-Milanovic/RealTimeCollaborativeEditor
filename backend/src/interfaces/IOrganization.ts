import { Document, Types } from "mongoose";

export interface IOrganization extends Document {
    name: string;
    organizer: Types.ObjectId;
    children: Array<Types.ObjectId>;
    files: Array<Types.ObjectId>;
    members: Array<Types.ObjectId>;
}
