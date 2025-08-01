import { Document, Types } from "mongoose";

export interface IReaction extends Document {
    comment: Types.ObjectId;
    reactionType: string,
    reactor: Types.ObjectId,
}

export type SimpleReaction = {
    comment: string;
    reactionType: string;
    reactor: string;
}

export function isSimpleReaction(obj:any): obj is SimpleReaction {
    return typeof obj === "object" && obj !== null &&
        "comment" in obj && typeof obj.comment === "string" &&
        "reactionType" in obj && typeof obj.reactionType === "string" &&
        "reactor" in obj && typeof obj.reactor === "string";
}