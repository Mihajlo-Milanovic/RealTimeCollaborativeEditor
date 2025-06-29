import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFile extends Document {
    name: string;
    owner: Types.ObjectId;
    collaborators: Record<string, 'read' | 'write'>;
    parentDirectory: Types.ObjectId;
}

const FileSchema: Schema<IFile> = new Schema({
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    collaborators: { type: Map, of: String, default: {} },
    parentDirectory: { type: Schema.Types.ObjectId, ref: 'Directory' },
}, { timestamps: true });

export default mongoose.model<IFile>('File', FileSchema);
