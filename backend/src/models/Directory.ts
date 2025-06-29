import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDirectory extends Document {
    _id: Types.ObjectId;
    name: string;
    owner: Types.ObjectId;
    parent: Types.ObjectId | null;
    children: Types.ObjectId[];
    files: Types.ObjectId[];
    collaborators: Record<string, 'read' | 'write'>;
}

const DirectorySchema: Schema<IDirectory> = new Schema({
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Directory', default: null },
    children: [{ type: Schema.Types.ObjectId, ref: 'Directory' }],
    files: [{ type: Schema.Types.ObjectId, ref: 'File' }],
    collaborators: { type: Map, of: String, default: {} },
}, { timestamps: true });

export default mongoose.model<IDirectory>('Directory', DirectorySchema);