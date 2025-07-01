import { Schema, Document, SchemaTypes, model } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    avatar?: string;
}

const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
        immutable: true
    },
    email: {
        type: SchemaTypes.String,
        required: true,
        unique: true
    },
    avatar: {
        type: SchemaTypes.String
    },
}, { timestamps: true });

export default model<IUser>('User', UserSchema);