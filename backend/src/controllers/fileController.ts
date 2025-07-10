import {IFile} from "../interfaces/IFile";
import {createNewFile, getDirectoriesFiles, getFileById} from "../services/fileService";
import {getDirectoriesStructured} from "../services/directoryService";


export const getFile = async (req: any, res: any) => {

    const fileId: string = req.query[`fileId`];
    const file: IFile | null = await getFileById(fileId);
    res.json(file).status(200);
};

export const getFilesInDirectory = async (req: any, res: any) => {

    const dirId: string = req.query[`dirId`];

    const files: Array<IFile> = await getDirectoriesFiles(dirId);
    res.json(files).status(200);
}

export const createFile = async (req: any, res: any) => {
    await createNewFile(req.body)
}