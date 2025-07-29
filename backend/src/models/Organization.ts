import { Schema, SchemaTypes, model } from 'mongoose';
import {IOrganization} from "../interfaces/IOrganization";

const OrganizationSchema: Schema<IOrganization> = new Schema({
    name: {
        type: SchemaTypes.String,
        required: true
    },
    creator: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    children: [{
        type: SchemaTypes.ObjectId,
        ref: 'Directory',
    }],
    collaborators: [{
        type: SchemaTypes.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

export default model<IOrganization>('Organization', OrganizationSchema);