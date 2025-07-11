import {IFile} from "../interfaces/IFile";
import * as fs from "../services/fileService";


export async function getFile(req: any, res: any) {

    const fileId: string = req.query[`fileId`];
    const file: IFile | null = await fs.getFileById(fileId);
    res.json(file).status(200);
}

export async function getFilesInDirectory(req: any, res: any) {

    const dirId: string = req.query[`dirId`];

    const files: Array<IFile> = await fs.getDirectoriesFiles(dirId);
    res.json(files).status(200);
}

export async function createFile(req: any, res: any) {
    const result = await fs.createFile(req.body);
    res.status(200).json(result);
}

export async function deleteFile(req: any, res: any) {
    try {
        const fileId: string = req.query[`fileId`];
        const file: IFile | null = await fs.getFileById(fileId);

        if (!file) {
            return res.status(404).json({ message: "Fajl nije nadjen." });
        }

        const success = await fs.deleteFile(file);
        if (!success) {
            return res.status(500).json({ message: "Neuspesno obrisan fajl." });
        }

        return res.status(200).json({ message: "Fajl obrisan uspeno." });
    } catch (error) {
        console.error("Greska pri brisanju fajla:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}
