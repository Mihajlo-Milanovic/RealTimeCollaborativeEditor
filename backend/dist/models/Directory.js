"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const directorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    parent: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Directory',
        default: null
    },
    children: [{
            type: mongoose_1.SchemaTypes.ObjectId,
            ref: 'Directory'
        }],
    files: [{
            type: mongoose_1.SchemaTypes.ObjectId,
            ref: 'File',
        }],
    collaborators: [{
            type: mongoose_1.SchemaTypes.ObjectId,
            ref: 'User',
        }],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Directory', directorySchema);
