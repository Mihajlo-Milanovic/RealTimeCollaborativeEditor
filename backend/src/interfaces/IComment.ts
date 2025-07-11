import { Document, ObjectId, Types } from "mongoose";

// podlozan promenama...
export interface IComment extends Document {
    commenter: Types.ObjectId;
    file: Types.ObjectId;
    content: string;
    reactions: Array<string>; // za sada niz stringova, videcemo...
}