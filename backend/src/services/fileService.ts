import File from "../models/File"
import Directory from "../models/Directory";
import { Types } from "mongoose"
import {IFile} from "../interfaces/IFile";
import {IDirectory} from "../interfaces/IDirectory";

export async function getFileById(fileId: string): Promise<IFile | null> {
    return File.findById(fileId);
}

export async function createFile (file: IFile): Promise<IFile | null> {

    const dir: IDirectory | null = await Directory.findById(file.parent);

    let newFile: IFile | null = null;

    if (dir) {
        newFile = await File.create(file);
        dir.files.push(newFile._id as Types.ObjectId);
        await dir.save();
    }
    return newFile;
}

export async function deleteFile(fileId: string): Promise<boolean> {
    try {
        const file: IFile | null = await File.findById(fileId);
        if (!file) {
            console.error("File not found.");
            return false;
        }

        const parentDir: IDirectory | null = await Directory.findById(file.parent);
        if (!parentDir) {
            console.error("Parent directory not found.");
            return false;
        }

        parentDir.files = parentDir.files.filter(fId => !fId.equals(file.id));
        await parentDir.save();

        await File.findByIdAndDelete(file.id);

        return true;
    } catch (err) {
        console.error("File deletion error:", err);
        return false;
    }
}
