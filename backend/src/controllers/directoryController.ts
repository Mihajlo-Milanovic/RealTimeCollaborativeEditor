import { NextFunction, Request, Response } from 'express';
import * as ds from "../services/directoryService";
import {IFile} from "../data/interfaces/IFile";
import { matchedData } from "express-validator";
import { checkForValidationErrors } from "../middlewares/validation/checkForValidationErrors";
import {IDirectory, INewDirectory} from "../data/interfaces/IDirectory";


export async function createDirectory (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const dir: INewDirectory = {...matchedData(req) };
        const result = await ds.createDirectory(dir);
        if (result)
            res.status(201).json({
                success: true,
                data: result,  
            });
        else
            res.status(400).json({
                success: false,
                message: "Couldn't create directory.",
            });
    }
    catch (err) {
        next(err);
    }
}

export async function deleteDirectory (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const { dirId } = matchedData(req);
        const result = await ds.deleteDirectory(dirId);
        //TODO: Mozda treba da se izmeni
        res.status(200).json({
                success: true,
                data: result,  
            });
    }
    catch (err) {
        next(err);
    }
}

export async function getUsersDirectories (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const { uuid } = matchedData(req);
        const result = await ds.getDirectoriesByOwnerId(uuid);
        if (result)
            res.status(200).json({
                success: true,
                data: result,  
            });
        else
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
    }
    catch (err) {
        next(err);
    }
}

export async function getUsersDirectoriesStructured (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const { uuid } = matchedData(req);
        const result = await ds.getDirectoriesStructured(uuid);
        if (result)
            res.status(200).json({
                success: true,
                data: result,  
            });
        else
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
    }
    catch (err) {
        next(err);
    }
}

export async function getDirectoryWithChildrenAndFiles(req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const { dirId } = matchedData(req);
        const result: IDirectory | null = await ds.getDirectoryWithChildrenAndFiles(dirId);
        if (result)
            res.status(200).json({
                success: true,
                data: result,  
            });
        else
            res.status(404).json({
                success: false,
                message: "Specified directory could not be found.",
                });
    }
    catch (err) {
        next(err);
    }  
}

export async function getUserRootDirectories(req: Request, res: Response, next: NextFunction) {
    if (checkForValidationErrors(req, res))
        return;

    try {
        const { uuid } = matchedData(req);
        const result = await ds.getUserRootDirectories(uuid);

        if (result)
            res.status(200).json({
                success: true,
                data: result,  
            });
        else
            res.status(404).json({
                success: false,
                message: "Root directory not found.",
                });
    }
    catch (err) {
        next(err);
    }
}

export async function getFilesInDirectory(req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const { dirId } = matchedData(req);
        const result: Array<IFile> | null = await ds.getFilesForDirectory(dirId);
        if (result)
            res.status(200).json({
                success: true,
                data: result,  
            });
        else
            res.status(404).json({
                success: false,
                message: "Specified directory could not be found.",
                });
    }
    catch (err) {
        next(err);
    }
}

export async function addChildrenByIds (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const { dirId, children } = matchedData(req);
        const result = await ds.addChildrenByIds(dirId, children);
        if (result)
            res.status(204).end();
        else
            res.status(404).json({
                success: false,
                message: "Directory not found.",
                });
    }
    catch (err){
        next(err);
    }
}

export async function removeFromChildrenByIds (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const { dirId, children } = matchedData(req);
        const result = await ds.removeFromChildrenByIds(dirId, children);
        if (result)
            res.status(204).end();
        else
            res.status(404).json({
                success: false,
                message: "Directory not found.",
                });
    }
    catch (err){
        next(err);
    }
}

export async function addFilesByIds (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const { dirId, files } = matchedData(req);
        const result = await ds.addFilesByIds(dirId, files);
        if (result)
            res.status(204).end();
        else
            res.status(404).json({
                success: false,
                message: "Directory not found.",
                });
    }
    catch (err) {
        next(err);
    }
}

export async function removeFromFilesByIds (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const { dirId, files } = matchedData(req);
        const result = await ds.removeFromFilesByIds(dirId, files);
        if (result)
            res.status(204).end();
        else
            res.status(404).json({
                success: false,
                message: "Directory not found.",
                });
    }
    catch (err){
        next(err);
    }
}