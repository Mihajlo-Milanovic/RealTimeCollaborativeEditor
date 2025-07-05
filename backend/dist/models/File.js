"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FileSchema = new mongoose_1.Schema({
    name: {
        type: mongoose_1.SchemaTypes.String,
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
        required: true
    },
    collaborators: [{
            type: mongoose_1.SchemaTypes.ObjectId,
            ref: 'User',
        }],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('File', FileSchema);
