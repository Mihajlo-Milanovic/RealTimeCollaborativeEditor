import { Request, Response } from 'express';
import * as ds from "../services/directoryService";
import {IFile} from "../data/interfaces/IFile";
import { matchedData } from "express-validator";
import { checkForValidationErrors } from "../middlewares/validation/checkForValidationErrors";
import {IDirectory, SimpleDirectory} from "../data/interfaces/IDirectory";


export async function createDirectory (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const dir: SimpleDirectory = {...matchedData(req) };
        const newDirectory = await ds.createDirectory(dir);
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

export async function deleteDirectory (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const { dirId } = matchedData(req);
        const result = await ds.deleteDirectory(dirId);
        //TODO: Mozda treba da se izmeni
        res.status(200).json(result).end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function getUsersDirectories (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const { uuid } = matchedData(req);
        const dirs = await ds.getDirectoriesByOwnerId(uuid);
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
        const { uuid } = matchedData(req);
        const dirs = await ds.getDirectoriesStructured(uuid);
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

export async function getDirectoryWithChildrenAndFiles(req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const { dirId } = matchedData(req);
        const dir: IDirectory | null = await ds.getDirectoryWithChildrenAndFiles(dirId);
        if (dir)
            res.status(200).json(dir).end();
        else
            res.status(404).send("Specified directory could not be found.").end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }  
}

export async function getUserRootDirectories(req: Request, res: Response) {
    if (checkForValidationErrors(req, res))
        return;

    try {
        const { uuid } = matchedData(req);
        const dirs = await ds.getUserRootDirectories(uuid);

        if (dirs)
            res.status(200).json(dirs).end();
        else
            res.status(404).send("Root directory not found.").end();
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function getFilesInDirectory(req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const { dirId } = matchedData(req);
        const files: Array<IFile> | null = await ds.getFilesForDirectory(dirId);
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

export async function addChildrenByIds (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const { dirId, children } = matchedData(req);
        const dir = await ds.addChildrenByIds(dirId, children);
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
        const { dirId, children } = matchedData(req);
        const dir = await ds.removeFromChildrenByIds(dirId, children);
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
        const { dirId, files } = matchedData(req);
        const dir = await ds.addFilesByIds(dirId, files);
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
        const { dirId, files } = matchedData(req);
        const dir = await ds.removeFromFilesByIds(dirId, files);
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

