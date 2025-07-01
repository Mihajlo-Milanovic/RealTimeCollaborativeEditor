import { Schema, Document, SchemaTypes, Types, model } from 'mongoose';

export interface IDirectory extends Document {
    name: string;
    owner: Types.ObjectId;
    parent: Types.ObjectId | null;
    children: Array<Types.ObjectId>;
    files: Array<Types.ObjectId>;
    collaborators: Array<Types.ObjectId>;
}

const directorySchema: Schema<IDirectory> = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    parent: {
        type: SchemaTypes.ObjectId,
        ref: 'Directory',
        default: null
    },
    children: [{
        type: SchemaTypes.ObjectId,
        ref: 'Directory'
    }],
    files: [{
        type: SchemaTypes.ObjectId,
        ref: 'File',
    }],
    collaborators: [{
        type: SchemaTypes.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

export default model<IDirectory>('Directory', directorySchema);