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

export const deleteFile = async (req: any, res: any) => {
    try {
        const fileId: string = req.query[`fileId`];

        const success = await fs.deleteFile(fileId);
        if (!success) {
            return res.status(404).json({ message: "Fajl nije uspesno obrisan." });
        }

        return res.status(200).json({ message: "Fajl uspesno obrisan." });
    } catch (error) {
        console.error("Greška pri brisanju fajla:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

