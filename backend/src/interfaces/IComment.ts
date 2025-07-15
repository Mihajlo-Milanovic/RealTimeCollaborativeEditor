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