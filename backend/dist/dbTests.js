"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./models/User"));
const File_1 = __importDefault(require("./models/File"));
const Directory_1 = __importDefault(require("./models/Directory"));
const db_1 = require("./config/db");
const populate = async () => {
    await (0, db_1.connectDB)();
    await User_1.default.deleteMany({});
    await File_1.default.deleteMany({});
    await Directory_1.default.deleteMany({});
    console.log("First user...");
    const alice = await User_1.default.create({
        username: 'Alice',
        email: 'alice@example.com'
    });
    console.log(alice);
    console.log("Second user...");
    const bob = await User_1.default.create({
        username: 'Bob',
        email: 'bob@example.com'
    });
    console.log(bob);
    console.log("First directory...");
    const dir1 = await Directory_1.default.create({
        name: 'Project 1',
        owner: alice._id,
        parent: null,
        path: './',
        children: [],
        files: [],
        collaborators: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    console.log(dir1);
    console.log("Second directory...");
    const dir2 = await Directory_1.default.create({
        name: 'Project 2',
        owner: bob._id,
        parent: null,
        children: [dir1._id],
        files: [],
        collaborators: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    console.log(dir2);
    console.log("Document...");
    const doc1 = await File_1.default.create({
        name: 'DesignDoc.md',
        owner: alice._id,
        collaborators: [bob._id],
        parent: dir2._id,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    console.log(doc1);
    dir1.files.push(doc1._id);
    await dir1.save();
    console.log('Population complete ');
    await (0, db_1.disconnectDB)();
    process.exit(0);
};
populate();
