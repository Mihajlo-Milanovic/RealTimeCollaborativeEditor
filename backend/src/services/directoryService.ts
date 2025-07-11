import Directory from "../models/Directory";
import {IDirectory} from "../interfaces/IDirectory";
import { Types } from "mongoose"
import {IFile} from "../interfaces/IFile";

export async function getDirectoriesByOwnerId (ownerId: string): Promise<Array<IDirectory>> {

    return Directory.find({ owner: ownerId });
}

export async function getDirectoriesStructured (ownerId: string): Promise<Array<IDirectory>> {

    const dirs: Array<IDirectory> = await Directory.find({
        owner: ownerId,
        parent: null
    })

    let directories: Array<IDirectory> = dirs.concat([])

    while(directories.length > 0) {
        let directory = directories.pop();

        if (directory == undefined)
            continue;

        await directory.populate('children');

        if (directory.populated('children')) {
            directories = directories.concat(directory.children as unknown as Array<IDirectory>);
        }
    }

    // This is recursive
    // await populateChildren(dirs);

    return dirs;
}

async function populateChildren (directories: Array<IDirectory>) {

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

export async function createDirectory (directory: IDirectory): Promise<IDirectory> {

    return Directory.create(directory);
}

export async function addChildrenByIds (directoryId: string, childrenIds: Array<string>): Promise<IDirectory | null> {

    const dir: IDirectory | null = await Directory.findById(directoryId);
    if (dir == null)
        return null

    const cids = childrenIds.map(childId =>
        new Types.ObjectId(childId)
    );
    dir.children.push(...cids);
    await dir.save()

    return dir
}

export async function addFilesByIds (directoryId: string, filesIds: Array<string>): Promise<IDirectory | null> {

    const dir: IDirectory | null = await Directory.findById(directoryId);
    if (dir == null)
        return null

    const fids = filesIds.map(fileId =>
        new Types.ObjectId(fileId)
    );

    dir.files.push(...fids);
    await dir.save()

    return dir
}