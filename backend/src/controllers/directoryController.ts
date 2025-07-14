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
        const files: Array<IFile> | null = await ds.getFilesForDirectory(queryParams.dirId);
        if (files)
            res.json(files).status(200);
        else
            res.status(404).send("Specified directory could not be found.");
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
        const bodyObj = matchedData(req) as IDirectory;
        console.log(bodyObj);
        const newDirectory = await ds.createDirectory(bodyObj);
        if (newDirectory)
            res.status(201).json(newDirectory);
        else
            res.status(500).send("Internal server error occurred.");
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
        const directory: string = req.body.directory;
        const children: Array<string> = req.body.children;

        const dir = await ds.addChildrenByIds(directory, children);
        if (dir)
            res.status(204);
        else
            res.status(404).send("Directory not found.");
    }
    catch (err){
        console.error(err);
        res.status(500).send("Internal server error occurred.");
    }
}

export async function addFilesByIds (req: any, res: any) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj: {directory: string, files: Array<string>} = matchedData(req);
        const dir = await ds.addFilesByIds(bodyObj.directory, bodyObj.files);
        if (dir)
            res.status(204);
        else
            res.status(404).send("Directory not found.");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.");
    }
}

export async function deleteDirectory (req: any, res: any) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams: { dirId: string } = matchedData(req);
        const result = await ds.deleteDirectory(queryParams.dirId);
        res.status(200).json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.");
    }
}