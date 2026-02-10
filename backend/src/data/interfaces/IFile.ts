import { Document, Types } from "mongoose";

export interface IFile extends Document {
    _id: Types.ObjectId;
    id: string;
    name: string;
    owner: Types.ObjectId;
    parent: Types.ObjectId;
    collaborators: Array<Types.ObjectId>;
    comments: Array<Types.ObjectId>;
}

export type SimpleFile = {
    name: string;
    owner: string;
    parent: string;
    collaborators: Array<string>;
    // comments: Array<Types.ObjectId>;
}

export function isSimpleFile(obj:any): obj is SimpleFile {
    if(typeof obj === "object" && obj !== null &&
        "name" in obj && typeof obj.name === "string" &&
        "owner" in obj && typeof obj.owner === "string" &&
        "parent" in obj && typeof obj.parent === "string" &&
        "collaborators" in obj && Array.isArray(obj.collaborators)
    ) {
        for (const collaborator of obj.collaborators) {
            if (typeof collaborator !== "string")
                return false;
        }

        return true;
    }
    return false;
}