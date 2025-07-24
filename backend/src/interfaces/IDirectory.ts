import { Document, Types } from "mongoose";
import {SimpleFile} from "./IFile";

export interface IDirectory extends Document {
    name: string;
    owner: Types.ObjectId;
    parent: Types.ObjectId | null;
    children: Array<Types.ObjectId>;
    files: Array<Types.ObjectId>;
    collaborators: Array<Types.ObjectId>;
    createdAt: Date;
}

export type SimpleDirectory = {
    name: string;
    owner: string;
    parent: string | null;
    children: Array<string>;
    files: Array<string>;
    collaborators: Array<string>;
}

export function isSimpleDirectory(obj:any): obj is SimpleDirectory {
    if(typeof obj === "object" && obj !== null &&
        "name" in obj && typeof obj.name === "string" &&
        "owner" in obj && typeof obj.owner === "string" &&
        "parent" in obj && (typeof obj.parent === "string" || typeof obj.parent === "object") &&
        "children" in obj && Array.isArray(obj.children) &&
        "files" in obj && Array.isArray(obj.files) &&
        "collaborators" in obj && Array.isArray(obj.collaborators)
    ) {
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