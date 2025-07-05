"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUsers = void 0;
const userService_1 = require("../services/userService");
const getUsers = async (req, res) => {
    const users = await (0, userService_1.getAllUsers)();
    res.json(users);
};
exports.getUsers = getUsers;
const createUser = async (req, res) => {
    const newUser = await (0, userService_1.createNewUser)(req, res);
    res.status(201).json(newUser);
};
exports.createUser = createUser;
