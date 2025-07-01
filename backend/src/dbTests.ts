import User from './models/User';
import Document from './models/File';
import Directory from './models/Directory';
import { Types } from "mongoose";
import { connectDB, disconnectDB } from './db';

const populate = async () => {
    await connectDB();

    await User.deleteMany({});
    await Document.deleteMany({});
    await Directory.deleteMany({});

    console.log("First user...")
    const alice = await User.create({
        username: 'Alice',
        email: 'alice@example.com'
    });
    console.log(alice);

    console.log("Second user...")
    const bob = await User.create({
        username: 'Bob',
        email: 'bob@example.com'
    });
    console.log(bob);

    console.log("First directory...")
    const dir1 = await Directory.create({
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
    const dir2 = await Directory.create({
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
    const doc1 = await Document.create({
        name: 'DesignDoc.md',
        owner: alice._id,
        collaborators: [bob._id],
        parent: dir2._id,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    console.log(doc1);

    dir1.files.push(doc1._id as Types.ObjectId);
    await dir1.save();

    console.log('Population complete ');
    process.exit(0);
};

populate()