import Directory from "../models/Directory";
import {IDirectory} from "../interfaces/IDirectory";
import populate from "mongoose";

export const getDirectoriesByOwnerId = async (ownerId: string): Promise<Array<IDirectory>> => {

    return Directory.find({ owner: ownerId });
}

export const getDirectoriesStructured = async (ownerId: string): Promise<Array<IDirectory>> => {

    const dirs: Array<IDirectory> = await Directory.find({
        owner: ownerId,
        parent: null
    })

    let directories: Array<IDirectory> = dirs.concat()

    while(directories.length > 0) {
        let directory = directories.pop() as IDirectory;

        await directory.populate('children');

        if (directory.populated('children')) {
            directories = directories.concat( directory.children as unknown as Array<IDirectory>);
        }
    }

    // This is recursive
    // await populateChildren(dirs);

    return dirs;
};

const populateChildren = async (directories: Array<IDirectory>) => {

    if (directories.length < 0) {
        return
    }

    for (const directory of directories) {
        await directory.populate("children");

        if (directory.populated("children")) {

            await populateChildren(directory.children as unknown as Array<IDirectory>);
        }
    }
}