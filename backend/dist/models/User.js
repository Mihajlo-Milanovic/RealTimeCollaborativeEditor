"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
        unique: true,
        immutable: true
    },
    email: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
        unique: true
    },
    avatar: {
        type: mongoose_1.SchemaTypes.String
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('User', UserSchema);
