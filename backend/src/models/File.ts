import { Schema, Document, SchemaTypes, Types, model } from 'mongoose';

export interface IFile extends Document {
    name: string;
    owner: Types.ObjectId;
    parent: Types.ObjectId;
    collaborators: Array<Types.ObjectId>;
}

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
    collaborators: [{
        type: SchemaTypes.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

export default model<IFile>('File', FileSchema);
