import { Schema, SchemaTypes, model } from 'mongoose';
import {IOrganization} from "../interfaces/IOrganization";

const OrganizationSchema: Schema<IOrganization> = new Schema({
    name: {
        type: SchemaTypes.String,
        required: true
    },
    organizer: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    members: {
        type: Map,
        of: {
            key: {type: SchemaTypes.String, ref: 'User'},
            value: {type: SchemaTypes.String, default: "viewer"}
        }
    },
    children: [{
        type: SchemaTypes.ObjectId,
        ref: 'Directory',
    }],
    projections: [{
        type: SchemaTypes.ObjectId,
        ref: 'Directory',
    }]
}, { timestamps: true });

export default model<IOrganization>('Organization', OrganizationSchema);