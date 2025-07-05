import {getDirectoriesByOwnerId, getDirectoriesStructured,} from "../services/directoryService";


export const getUsersDirectories = async (req: any, res: any) => {

    const userId: string = req.query[`uuid`];
    const dirs = await getDirectoriesByOwnerId(userId);
    res.json(dirs).status(200);

};

export const getUsersDirectoriesStructured = async (req: any, res: any) => {

    const userId: string = req.query[`uuid`];
    const dirs = await getDirectoriesStructured(userId);
    if (dirs)
        res.status(200).json(dirs);
    else
        res.status(404).end().set("Not Found");
};