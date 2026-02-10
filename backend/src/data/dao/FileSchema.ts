import { Schema, SchemaTypes, model } from 'mongoose';
import { IFile } from "../interfaces/IFile";

const FileSchema: Schema<IFile> = new Schema({
    name: {
        type: SchemaTypes.String,
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
        required: true
    },
}, { timestamps: true });

export default model<IFile>('File', FileSchema);
