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