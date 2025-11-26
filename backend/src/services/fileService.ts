import File from "../data/models/File"
import Directory from "../data/models/Directory";
import { Types } from "mongoose"
import {IFile, SimpleFile} from "../data/interfaces/IFile";
import {IDirectory} from "../data/interfaces/IDirectory";


export async function createFile (file: SimpleFile): Promise<IFile | null> {

    const dir: IDirectory | null = await Directory.findById(file.parent);

    if (dir) {
        let newFile: IFile | null = await File.create(file);
        if (newFile) {
            dir.files.push(newFile._id as Types.ObjectId);
            await dir.save();
        }
        return newFile;
    }
    return null;
}

export async function deleteFile(fileId: string): Promise<boolean> {

        const file: IFile | null = await File.findById(fileId);
        if (!file)
            return false;

        const parentDir: IDirectory | null = await Directory.findById(file.parent);
        if (!parentDir)
            return false;

        parentDir.files = parentDir.files.filter(fId => !fId.equals(file.id));
        await parentDir.save();

        await File.findByIdAndDelete(file.id);

        return true;
}

export async function getFileById(fileId: string): Promise<IFile | null> {
    return File.findById(fileId);
}
