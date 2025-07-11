import File from "../models/File"
import Directory from "../models/Directory";
import { Types } from "mongoose"
import {IFile} from "../interfaces/IFile";
import {IDirectory} from "../interfaces/IDirectory";

export const getFileById = async (fileId: string): Promise<IFile | null> => {
    return File.findById(fileId);
};

export async function createFile (file: IFile): Promise<IFile | null> {

    const dir: IDirectory | null = await Directory.findById(file.parent);

    let newFile: IFile | null = null;

    if (dir != null) {
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
            console.error("Fajl nije pronađen.");
            return false;
        }

        const parentDir: IDirectory | null = await Directory.findById(file.parent);
        if (!parentDir) {
            console.error("Nije pronadjen roditeljski direktorijum.");
            return false;
        }

        parentDir.files = parentDir.files.filter(fId => !fId.equals(file.id));
        await parentDir.save();

        await File.findByIdAndDelete(file.id);

        return true;
    } catch (err) {
        console.error("Greška pri brisanju fajla:", err);
        return false;
    }
}

//Treba li ovo da bude ovde???
export const getDirectoriesFiles = async (dirId: string): Promise<Array<IFile>> => {
    const dir: IDirectory | null = await Directory.findById(dirId).populate('files');
    let result: Array<IFile> = [];
    if (dir && dir.populated('files'))
        result = dir.files as unknown as Array<IFile>;

   return result;
};