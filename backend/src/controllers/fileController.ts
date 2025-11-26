import {IFile, SimpleFile} from "../data/interfaces/IFile";
import * as fs from "../services/fileService";
import {checkForValidationErrors} from "../middlewares/validation/checkForValidationErrors";
import {isIUser, SimpleUser} from "../data/interfaces/IUser";
import {matchedData} from "express-validator";
import * as us from "../services/userService";


export const createFile = async (req: any, res: any) => {

    if (checkForValidationErrors(req, res)) {
        return;
    }

    try {
        const file: SimpleFile = {...matchedData(req)};
        const newFile = await fs.createFile(file);
        if (newFile)
            res.status(201).json(newFile).end();
        else
            res.status(500).json(newFile).send("Internal server error occurred.").end();
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export const deleteFile = async (req: any, res: any) => {

    if(checkForValidationErrors(req, res))
        return;

    try {
        const { fileId } = matchedData(req);
        const success = await fs.deleteFile(fileId);
        if (success)
            return res.status(200).json("File successfully deleted.").end();
        else
            return res.status(404).json("File deletion unsuccessful.").end();

    } catch (error) {
        return res.status(500).send("Internal server error occurred.").end();
    }
};

export const getFile = async (req: any, res: any) => {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const { fileId } = matchedData(req);

        const file: IFile | null = await fs.getFileById(fileId);

        if (file)
            res.status(200).json(file).end();
        else
            res.status(404).json("File not found.").end();
    }
    catch (err) {
        return res.status(500).send("Internal server error occurred.").end();
    }
};

