import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    name: string;
    avatar?: string;
    ownedFiles: Types.ObjectId[];
    accessFiles: Types.ObjectId[];
    accessDirs: Types.ObjectId[];
}

const UserSchema: Schema<IUser> = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String },
    ownedFiles: [{ type: Schema.Types.ObjectId, ref: 'File' }],
    accessFiles: [{ type: Schema.Types.ObjectId, ref: 'File' }],
    accessDirs: [{ type: Schema.Types.ObjectId, ref: 'Directory' }],
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);