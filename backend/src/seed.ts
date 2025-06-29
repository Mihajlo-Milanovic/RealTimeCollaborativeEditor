import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from './models/User';
import File from './models/File';
import Directory from './models/Directory';
import connectDB from './db';

dotenv.config();

const seed = async () => {
    await connectDB();

    // Clean old data
    await User.deleteMany({});
    await File.deleteMany({});
    await Directory.deleteMany({});

    // Create Users
    const alice = new User({ name: 'Alice', email: 'alice@example.com' });
    const bob = new User({ name: 'Bob', email: 'bob@example.com' });

    await alice.save();
    await bob.save();

    // Create Directory (owned by Alice)
    const sharedDir = new Directory({
        name: 'Shared Project',
        owner: alice._id,
        parent: null,
        children: [],
        files: [],
        collaborators: {
            [bob._id.toString()]: 'write',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    await sharedDir.save();

    // Create File (in sharedDir)
    const designDoc = new File({
        name: 'DesignDoc.md',
        owner: alice._id,
        collaborators: {
            [bob._id.toString()]: 'write',
        },
        parentDirectory: sharedDir._id,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    await designDoc.save();

    // Update Directory with file ref
    sharedDir.files.push(designDoc._id);
    await sharedDir.save();

    // Update Users with access
    alice.ownedFiles.push(designDoc._id);
    bob.accessFiles.push(designDoc._id);
    bob.accessDirs.push(sharedDir._id);
    await alice.save();
    await bob.save();

    console.log('✅ Seed complete');
    process.exit(0);
};

seed();
