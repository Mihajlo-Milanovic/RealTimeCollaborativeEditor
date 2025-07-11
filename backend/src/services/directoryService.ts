import Directory from "../models/Directory";
import File from "../models/File";
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

export async function createDirectory (directory: IDirectory): Promise<IDirectory | null> {

    const parentDirectory: IDirectory | null = await Directory.findById(directory.parent);

    let newDirectory: IDirectory | null = null;
    if (parentDirectory != null) {

        newDirectory = await Directory.create(directory);
        parentDirectory.children.push(newDirectory._id as Types.ObjectId)
        await parentDirectory.save()
    }
    return newDirectory
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

        const dc: Array<IDirectory> = dir.children as unknown as Array<IDirectory>;

        let forDeletion: Array<IDirectory> = [dir];
        forDeletion.push(...dc);

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