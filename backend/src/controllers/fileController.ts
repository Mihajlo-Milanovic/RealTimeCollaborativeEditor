import {IFile} from "../interfaces/IFile";
import * as fs from "../services/fileService";


export const getFile = async (req: any, res: any) => {

    const fileId: string = req.query[`fileId`];
    const file: IFile | null = await fs.getFileById(fileId);
    res.json(file).status(200);
};

export const createFile = async (req: any, res: any) => {
    const result = await fs.createFile(req.body);
    res.status(200).json(result);
}

export const deleteFile = async (req: any, res: any) => {
    try {
        const fileId: string = req.query[`fileId`];

        const success = await fs.deleteFile(fileId);
        if (!success) {
            return res.status(404).json({ message: "File deletion unsuccessful." });
        }

        return res.status(200).json({ message: "File successfully deleted." });
    } catch (error) {
        console.error("File deletion error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

