import * as ds from "../services/directoryService";
import {IFile} from "../interfaces/IFile";
import {validationResult, matchedData } from "express-validator";
import { checkForValidationErrors } from "../middlewares/validation/checkForValidationErrors";
import {IDirectory} from "../interfaces/IDirectory";


export async function getUsersDirectories (req: any, res: any) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams = matchedData(req);
        const dirs = await ds.getDirectoriesByOwnerId(queryParams.uuid);
        res.json(dirs).status(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.");
    }
}

export async function getUsersDirectoriesStructured (req: any, res: any) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams = matchedData(req);
        const dirs = await ds.getDirectoriesStructured(queryParams.uuid);
        res.status(200).json(dirs);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.");
    }
}

export async function getFilesInDirectory(req: any, res: any) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams = matchedData(req);
        const files: Array<IFile> = await ds.getFilesForDirectory(queryParams.dirId);
        res.json(files).status(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.");
    }
}

export async function createDirectory (req: any, res: any) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj = matchedData(req);
        const newDirectory = await ds.createDirectory(bodyObj as IDirectory);
        res.status(201).json(newDirectory);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.");
    }

}

export async function addChildrenByIds (req: any, res: any) {

    if (checkForValidationErrors(req, res))
        return;

    try {


        await ds.addChildrenByIds(req.body.directory, req.body.children);
        res.status(204);

    }
    catch (err){
        console.error(err);
        res.status(500).send("Internal server error occurred.");
    }


}

export async function addFilesByIds (req: any, res: any) {

    await ds.addFilesByIds(req.body.directory, req.body.files);
    res.status(204);
}

export async function deleteDirectory (req: any, res: any) {

    const dirId = req.query[`dirId`];
    const result = await ds.deleteDirectory(dirId);
    res.status(200).json(result);
}