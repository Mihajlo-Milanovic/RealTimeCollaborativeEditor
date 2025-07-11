import {IFile} from "../interfaces/IFile";
import * as fs from "../services/fileService";


export const getFile = async (req: any, res: any) => {

    const fileId: string = req.query[`fileId`];
    const file: IFile | null = await fs.getFileById(fileId);
    res.json(file).status(200);
};

export const getFilesInDirectory = async (req: any, res: any) => {

    const dirId: string = req.query[`dirId`];

    const files: Array<IFile> = await fs.getDirectoriesFiles(dirId);
    res.json(files).status(200);
}

export const createFile = async (req: any, res: any) => {
    const result = await fs.createFile(req.body);
    res.status(200).json(result);
}