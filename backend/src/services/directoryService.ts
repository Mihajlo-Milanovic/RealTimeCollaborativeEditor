import Directory from "../data/models/Directory";
import File from "../data/models/File";
import User from "../data/models/User";
import {IDirectory, SimpleDirectory} from "../data/interfaces/IDirectory";
import {Types} from "mongoose"
import {IFile} from "../data/interfaces/IFile";
import {IUser} from "../data/interfaces/IUser";
import {NumberOfDeletions} from "../data/classes/NumberOfDeletions";

export async function getDirectoriesByOwnerId (ownerId: string): Promise<Array<IDirectory> | null> {

    const owner: IUser | null = await User.findById(ownerId);
    if (owner)
        return Directory.find({ owner: ownerId });
    else
        return null;
}

export async function getDirectoryWithChildrenAndFiles(dirId: string): Promise<IDirectory | null> {

    return await Directory.findById(dirId).populate(['files', 'children']).exec();
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

export async function createDirectory (directory: SimpleDirectory): Promise<IDirectory | null> {

    let newDirectory: IDirectory | null = await Directory.create(directory);

    if(directory.parents.length > 0) {

        const parentDirectories: Array<IDirectory> | null = await Directory.find({ _id: {$in: directory.parents} })
                                                                            .select('children');

        for (const parentDirectory of parentDirectories) {
            parentDirectory.children.push(newDirectory._id as Types.ObjectId)
            await parentDirectory.save()
        }
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

    const numberOfDeletions = new NumberOfDeletions();

    if (dir == null)
        return numberOfDeletions;

    if(dir.parents.length != 0 && dir.populated('parent')){

        for(const p of dir.parents){
            const parentDir = p as unknown as IDirectory;

            parentDir.children = parentDir.children.filter(child => child != dir._id);
            await parentDir.save();
        }
    }

    if (dir.populated('children')) {

        let forDeletion: Array<IDirectory> = [dir, ...dir.children as unknown as Array<IDirectory>];

        while (forDeletion.length > 0) {

            let d = forDeletion.pop();

            if (d == undefined)
                continue;

            if (d.files.length > 0){
                for (const file of d.files) {
                    await File.findByIdAndDelete(file._id);
                    numberOfDeletions.filesDeleted++;
                }
            }

            await d.populate('children');
            if (d.children.length > 0 && d.populated('children')) {
                forDeletion.push(...d.children as unknown as Array<IDirectory>);
            }

            await Directory.findByIdAndDelete(d._id);
            numberOfDeletions.directoriesDeleted++;
        }
    }

    return numberOfDeletions;
}