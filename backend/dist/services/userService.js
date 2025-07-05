"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewUser = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const getAllUsers = async () => {
    return User_1.default.find();
};
exports.getAllUsers = getAllUsers;
const createNewUser = async (req, res) => {
    return User_1.default.create(req.body);
};
exports.createNewUser = createNewUser;
