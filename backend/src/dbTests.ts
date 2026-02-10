import User from './data/dao/UserSchema';
import File from './data/dao/FileSchema';
import Directory from './data/dao/DirectorySchema';
import {Document, Model, Types} from "mongoose";
import {connectDB, disconnectDB} from './config/db';
import {IDirectory} from "./data/interfaces/IDirectory";
import {IFile} from "./data/interfaces/IFile";
import {IUser} from "./data/interfaces/IUser";

const populate = async () => {
    await connectDB();

    await User.deleteMany({});
    await File.deleteMany({});
    await Directory.deleteMany({});

    console.log("First user...")
    const alice: IUser = await User.create({
        username: 'Alice',
        email: 'alice@example.com'
    });

    console.log("Second user...")
    let bob: IUser = await User.create({
        username: 'Bob',
        email: 'bob@example.com'
    });

    ////This throws because E-mail
    // console.log("Third user...")
    // let bob2: IUser = await User.create({
    //     username: 'BobAgain',
    //     email: 'bob@example.com'
    // });

    console.log("Directory [owner: Alice]...")
    let dirAlcie: IDirectory = await Directory.create({
        name: 'Alices #root directory',
        owner: alice._id,
        parent: null,
        children: [],
        files: [],
        collaborators: [],
        createdAt: new Date(),
    });

    console.log("Nesting directories [1->3->2] ...");
    let dirNumerator = 3
    for (;dirNumerator < 6; dirNumerator++){
        let newDir: IDirectory = await Directory.create({
            name: `Project 1 -> dir ${dirNumerator}`,
            owner: alice?._id,
            parent: dirAlcie,
            children: [],
            files: [],
            collaborators: [],
            createdAt: new Date(),
        });

        dirAlcie.children.push(newDir._id as Types.ObjectId);
        await newDir.save();

        for (let i = 0; i < 2; i++) {
            let leafDir: IDirectory = await Directory.create({
                name: `Project 1 -> dir ${dirNumerator} -> Leaf Dir ${i}`,
                owner: alice,
                parent: newDir,
                children: [],
                files: [],
                collaborators: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            newDir.children.push(leafDir._id as Types.ObjectId);
            await newDir.save();
        }
    }

    console.log("Directory [owner: Bob]...");
    let dirBob : IDirectory = await Directory.create({
        name: 'Bobs #root directory',
        owner: bob?._id,
        parent: null,
        children: [],
        files: [],
        collaborators: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    console.log("Nesting directories [Bobs #root directory->1->2->3->4->5] ...");
    dirNumerator = 1
    let currentDir = dirBob
    for (;dirNumerator < 6; dirNumerator++){

        let newDir: IDirectory = await Directory.create({
            name: `Bobs nested directory #${dirNumerator}`,
            owner: bob?._id,
            parent: currentDir,
            children: [],
            files: [],
            collaborators: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        currentDir.children.push(newDir._id as Types.ObjectId)
        await currentDir.save();
        currentDir = newDir
    }

    console.log("File for Alice...");
    let docAlice: IFile = await File.create({
        name: 'AliceDoc.md',
        owner: alice?._id,
        collaborators: [bob?._id],
        parent: dirBob?._id,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    dirAlcie?.files.push(docAlice?._id as Types.ObjectId);
    await dirAlcie?.save();

    console.log("File for Bob...");
    let docBob: IFile = await File.create({
        name: 'BobDoc.md',
        owner: bob?._id,
        collaborators: [bob?._id],
        parent: dirBob?._id,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    currentDir.files.push(docBob._id as Types.ObjectId)
    await currentDir.save();


    console.log('Population complete ');
    await disconnectDB();
    process.exit(0);
};

populate()