import {IFile, INewFile} from "../data/interfaces/IFile";
import * as fs from "../services/fileService";
import {checkForValidationErrors} from "../middlewares/validation/checkForValidationErrors";
import {matchedData} from "express-validator";
import {Request, Response, NextFunction} from "express";


export async function createFile(req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res)) {
        return;
    }

    try {
        const data: INewFile = matchedData(req);

        const result = await fs.createFile(data);

        if (result != null)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(400).json({
                success: false,
                message: "Couldn't create a file.",
            });
    }
    catch (err) {
       next(err);
    }
}

export async function deleteFile(req: Request, res: Response, next: NextFunction) {

    if(checkForValidationErrors(req, res))
        return;

    try {
        const data: {id: string} = matchedData(req);

        const result = await fs.deleteFile(data.id);

        if (result != null)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(400).json({
                success: false,
                message: "File not found.",
            });

    } catch (err) {
       next(err);
    }
}

export async function getFile(req: Request, res: Response, next: NextFunction){

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: {id: string} = matchedData(req);

        const result = await fs.getFileById(data.id);

        if (result != null)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(404).json({
                success: false,
                message: "File not found.",
            });
    }
    catch (err) {
       next(err);
    }
}

export async function getCommentsForFile(req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: { id: string } = matchedData(req);

        const result = await fs.getCommentsForFile(data.id);

        if (result != null)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(404).json({
                success: false,
                message: "File not found.",
            });
    }
    catch (err){
        next(err)
    }
}
