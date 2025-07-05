import { Schema, SchemaTypes, model } from 'mongoose';
import { IDirectory } from '../interfaces/IDirectory';

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