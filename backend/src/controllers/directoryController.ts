import * as ds from "../services/directoryService";
import {IDirectory} from "../interfaces/IDirectory";


export async function getUsersDirectories (req: any, res: any) {

    const userId: string = req.query[`uuid`];
    const dirs = await ds.getDirectoriesByOwnerId(userId);
    res.json(dirs).status(200);

}

export async function getUsersDirectoriesStructured (req: any, res: any) {

    const userId: string = req.query[`uuid`];
    const dirs = await ds.getDirectoriesStructured(userId);
    if (dirs)
        res.status(200).json(dirs);
    else
        res.status(404).end().set("Not Found");
}

export async function createDirectory (req: any, res: any) {

    const newDirectory = await ds.createDirectory(req.body);
    res.status(201).json(newDirectory);
}

export async function addChildrenByIds (req: any, res: any) {

    await ds.addChildrenByIds(req.body.directory, req.body.children);
    res.status(204);
}

export async function addFilesByIds (req: any, res: any) {

    await ds.addFilesByIds(req.body.directory, req.body.files);
    res.status(204);
}