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

export function isSimpleOrganization(obj:any): obj is SimpleOrganization {
    if(typeof obj === "object" && obj !== null &&
        "name" in obj && typeof obj.name === "string" &&
        "organizer" in obj && typeof obj.organizer === "string" &&
        "children" in obj && Array.isArray(obj.children) &&
        "files" in obj && Array.isArray(obj.files) &&
        "members" in obj && Array.isArray(obj.members) &&
        "projections" in obj && Array.isArray(obj.projections)
    ) {

        for (const child of obj.children) {
            if (typeof child !== "string")
                return false;
        }

        for (const file of obj.files) {
            if (typeof file !== "string")
                return false;
        }

        for (const member of obj.members) {
            if (typeof member !== "string")
                return false;
        }

        for (const projection of obj.projections) {
            if (typeof projection !== "string")
                return false;
        }

        return true;
    }
    return false;
}