import File from "../models/File"
import {IFile} from "../interfaces/IFile";
import Directory from "../models/Directory";
import {IDirectory} from "../interfaces/IDirectory";

export const getFileById = async (fileId: string): Promise<IFile | null> => {
    return File.findById(fileId);
};

//Treba li ovo da bude ovde???
export const getDirectoriesFiles = async (dirId: string): Promise<Array<IFile>> => {
    const dir: IDirectory | null = await Directory.findById(dirId).populate('files');
    let result: Array<IFile> = [];
    if (dir && dir.populated('files'))
        result = dir.files as unknown as Array<IFile>;

   return result;
};

export const createNewFile = async (file: IFile): Promise<IFile> => {
    return await File.create(file);
}