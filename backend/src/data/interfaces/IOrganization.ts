import { Document, Types } from "mongoose";
import {UserPrivileges} from "../types/UserPrivileges";

export interface IOrganization extends Document {
    _id: Types.ObjectId;
    id: string;
    name: string;
    organizer: Types.ObjectId;
    children: Array<Types.ObjectId>;
    projections: Array<Types.ObjectId>;
    members: Map<string, UserPrivileges>;
}

export type INewOrganization = {
    name: string;
    organizer: string;
}
