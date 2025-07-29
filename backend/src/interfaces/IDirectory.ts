import { Document, Types } from "mongoose";
import {SimpleFile} from "./IFile";

export interface IDirectory extends Document {
    name: string;
    owner: Types.ObjectId;
    parents: Array<Types.ObjectId>;
    children: Array<Types.ObjectId>;
    files: Array<Types.ObjectId>;
    collaborators: Array<Types.ObjectId>;
    createdAt: Date;
}

export type SimpleDirectory = {
    name: string;
    owner: string;
    parents: Array<string>;
    children: Array<string>;
    files: Array<string>;
    collaborators: Array<string>;
}

export function isSimpleDirectory(obj:any): obj is SimpleDirectory {
    if(typeof obj === "object" && obj !== null &&
        "name" in obj && typeof obj.name === "string" &&
        "owner" in obj && typeof obj.owner === "string" &&
        "parents" in obj && Array.isArray(obj.parent) &&
        "children" in obj && Array.isArray(obj.children) &&
        "files" in obj && Array.isArray(obj.files) &&
        "collaborators" in obj && Array.isArray(obj.collaborators)
    ) {
        for (const parent of obj.parents) {
            if (typeof parent !== "string")
                return false;
        }

        for (const child of obj.children) {
            if (typeof child !== "string")
                return false;
        }

        for (const file of obj.files) {
            if (typeof file !== "string")
                return false;
        }

        for (const collaborator of obj.collaborators) {
            if (typeof collaborator !== "string")
                return false;
        }

        return true;
    }
    return false;


}