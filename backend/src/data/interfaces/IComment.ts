import { Document, Types } from "mongoose";
import {IReaction} from "./IReaction";

export interface IComment extends Document {
    commenter: Types.ObjectId;
    file: Types.ObjectId;
    content: string;
    edited: boolean;
    reactions: Array<IReaction>;
}

export type SimpleComment = {
    commenter: string;
    file: string;
    content: string;
}

export function isSimpleComment(obj:any): obj is SimpleComment {
    return typeof obj === "object" && obj !== null &&
        "commenter" in obj && typeof obj.commenter === "string" &&
        "file" in obj && typeof obj.file === "string" &&
        "content" in obj && typeof obj.content === "string";
}