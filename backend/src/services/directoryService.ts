import Directory from "../models/Directory";
import File from "../models/File";
import User from "../models/User";
import {IDirectory} from "../interfaces/IDirectory";
import {Types} from "mongoose"
import {IFile} from "../interfaces/IFile";
import {IUser} from "../interfaces/IUser";

export async function getDirectoriesByOwnerId (ownerId: string): Promise<Array<IDirectory> | null> {

    const owner: IUser | null = await User.findById(ownerId);
    if (owner)
        return Directory.find({ owner: ownerId });
    else
        return null;
}

export async function getChildrenAndFilesForDirectory(dirId: string): Promise<IDirectory | null> {
    
    const dir: IDirectory | null = await Directory.findById(dirId).populate(['files', 'children']);
    
    if (dir) 
        return dir;
    return null;
}

export async function getUserRootDirectory(ownerId: string): Promise<IDirectory | null> {
    return Directory.findOne({ owner: ownerId, parent: null });
}

export async function getDirectoriesStructured (ownerId: string): Promise<Array<IDirectory> | null> {

    const owner: IUser | null = await User.findById(ownerId);

    if (owner){
        const dirs: Array<IDirectory> = await Directory.find({
            owner: ownerId,
            parent: null
        });

        await populateChildrenIterative(dirs);
        // await populateChildrenRecursive(dirs);

        return dirs;
    }
    else
        return null;
}

async function populateChildrenIterative(directories: Array<IDirectory>){

    let dirs: Array<IDirectory> = directories.concat([]);

    while(dirs.length > 0) {
        let directory = dirs.pop();

        if (directory == undefined)
            continue;

        await directory.populate('children');

        if (directory.populated('children')) {
            dirs = dirs.concat(directory.children as unknown as Array<IDirectory>);
        }
    }
}

async function populateChildrenRecursive(directories: Array<IDirectory>) {

    if (directories.length < 0) {
        return
    }

    for (const directory of directories) {
        await directory.populate("children");

        if (directory.populated("children")) {
            await populateChildrenRecursive(directory.children as unknown as Array<IDirectory>);
        }
    }
}

export async function getFilesForDirectory(dirId: string): Promise<Array<IFile> | null> {

    const dir: IDirectory | null = await Directory.findById(dirId).populate('files');

    let result: Array<IFile> | null = null;
    if (dir) {
        result = [];
        if (dir.populated('files'))
            result = dir.files as unknown as Array<IFile>;
    }
    return result;
}

export async function createDirectory (directory: IDirectory): Promise<IDirectory | null> {

    let newDirectory: IDirectory | null = null;

    if(directory.parent) {
        const parentDirectory: IDirectory | null = await Directory.findById(directory.parent);

        if (parentDirectory != null) {
            newDirectory = await Directory.create(directory);
            parentDirectory.children.push(newDirectory._id as Types.ObjectId)
            await parentDirectory.save()
        }
    }
    else {
        newDirectory = await Directory.create(directory);
    }

    return newDirectory;
}

export async function addChildrenByIds (directoryId: string, childrenIds: Array<string>): Promise<IDirectory | null> {

    const dir: IDirectory | null = await Directory.findById(directoryId);

    if (dir) {
        childrenIds = [...new Set(
            childrenIds.concat(
                dir.children
                    .map(child => child.toHexString())
            )
        )];

        dir.children = childrenIds.map(childId =>
            new Types.ObjectId(childId)
        );
        await dir.save();
    }
    return dir;
}

export async function removeFromChildrenByIds (directoryId: string, childrenIdsToRemove: Array<string>): Promise<IDirectory | null> {

    const dir: IDirectory | null = await Directory.findById(directoryId);

    if (dir) {
        const toRemove = new Set(childrenIdsToRemove);
        const childrenIds = dir.children
            .map(child => child.toHexString())
            .filter(el => !toRemove.has(el));

        dir.children = childrenIds.map(childId =>
            new Types.ObjectId(childId)
        );
        await dir.save();
    }
    return dir;
}

export async function addFilesByIds (directoryId: string, filesIds: Array<string>): Promise<IDirectory | null> {

    const dir: IDirectory | null = await Directory.findById(directoryId);

    if (dir) {
        filesIds = [...new Set(
            filesIds.concat(
                dir.files
                    .map(file => file.toHexString())
            )
        )];

        dir.files = filesIds.map(fileId =>
            new Types.ObjectId(fileId)
        );
        await dir.save();
    }
    return dir;
}

export async function removeFromFilesByIds (directoryId: string, filesIdsToRemove: Array<string>): Promise<IDirectory | null> {

    const dir: IDirectory | null = await Directory.findById(directoryId);

    if (dir) {
        const toRemove = new Set(filesIdsToRemove);
        const filesIds = dir.files
            .map(file => file.toHexString())
            .filter(el => !toRemove.has(el));

        dir.files = filesIds.map(fileId =>
            new Types.ObjectId(fileId)
        );
        await dir.save();
    }
    return dir;
}

export async function deleteDirectory (directoryId: string) {

    const dir: IDirectory | null = await Directory.findById(directoryId).populate(['children', 'parent']).exec();

    if (dir == null)
        return;

    if(dir.parent != null && dir.populated('parent')){

        const dirParent = dir.parent as unknown as IDirectory;

        const dirIndex: number = dirParent.children.findIndex(child => child == dir._id);
        dirParent.children.splice(1, dirIndex);
        await dirParent.save();
    }

    let filesDeleted = 0;
    let directoriesDeleted = 0;

    if (dir.populated('children')) {

        let forDeletion: Array<IDirectory> = [dir, ...dir.children as unknown as Array<IDirectory>];

        while (forDeletion.length > 0) {

            let d = forDeletion.pop();

            if (d == undefined)
                continue;

            await d.populate(['children','files']);

            if (d.populated('files') && d.files.length > 0){
                for (const file of d.files) {
                    await File.findByIdAndDelete(file._id);
                    filesDeleted++;
                }
            }

            if (d.populated('children')) {
                forDeletion.push(...d.children as unknown as Array<IDirectory>);
            }

            await Directory.findByIdAndDelete(d._id);
            directoriesDeleted++;
        }
    }

    return { directoriesDeleted, filesDeleted };
}