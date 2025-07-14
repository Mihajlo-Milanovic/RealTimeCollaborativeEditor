import { Request, Response } from 'express';
import * as ds from "../services/directoryService";
import {IFile} from "../interfaces/IFile";
import {validationResult, matchedData } from "express-validator";
import { checkForValidationErrors } from "../middlewares/validation/checkForValidationErrors";
import {IDirectory} from "../interfaces/IDirectory";


export async function getUsersDirectories (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams = matchedData(req);
        const dirs = await ds.getDirectoriesByOwnerId(queryParams.uuid);
        if (dirs)
            res.status(200).json(dirs).end();
        else
            res.status(404).send("User not found.").end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function getUsersDirectoriesStructured (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams = matchedData(req);
        const dirs = await ds.getDirectoriesStructured(queryParams.uuid);
        if (dirs)
            res.status(200).json(dirs).end();
        else
            res.status(404).send("User not found.").end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function getFilesInDirectory(req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams = matchedData(req);
        const files: Array<IFile> | null = await ds.getFilesForDirectory(queryParams.dirId);
        if (files)
            res.status(200).json(files).end();
        else
            res.status(404).send("Specified directory could not be found.").end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function createDirectory (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj = matchedData(req) as IDirectory;
        console.log(bodyObj);
        const newDirectory = await ds.createDirectory(bodyObj);
        if (newDirectory)
            res.status(201).json(newDirectory).end();
        else
            res.status(500).send("Internal server error occurred.").end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }

}

export async function addChildrenByIds (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj: {directory: string, children: Array<string>} = matchedData(req);
        const dir = await ds.addChildrenByIds(bodyObj.directory, bodyObj.children);
        if (dir)
            res.status(204).end();
        else
            res.status(404).send("Directory not found.").end();
    }
    catch (err){
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function removeFromChildrenByIds (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj: {directory: string, children: Array<string>} = matchedData(req);
        const dir = await ds.removeFromChildrenByIds(bodyObj.directory, bodyObj.children);
        if (dir)
            res.status(204).end();
        else
            res.status(404).send("Directory not found.").end();
    }
    catch (err){
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function addFilesByIds (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj: {directory: string, files: Array<string>} = matchedData(req);
        const dir = await ds.addFilesByIds(bodyObj.directory, bodyObj.files);
        if (dir)
            res.status(204).end();
        else
            res.status(404).send("Directory not found.").end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function removeFromFilesByIds (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj: {directory: string, files: Array<string>} = matchedData(req);
        const dir = await ds.removeFromFilesByIds(bodyObj.directory, bodyObj.files);
        if (dir)
            res.status(204).end();
        else
            res.status(404).send("Directory not found.").end();
    }
    catch (err){
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function deleteDirectory (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams: { dirId: string } = matchedData(req);
        const result = await ds.deleteDirectory(queryParams.dirId);
        res.status(200).json(result).end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}