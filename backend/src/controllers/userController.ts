import { Request, Response } from "express";
import * as us from "../services/userService";
import {IUser} from "../interfaces/IUser";
import {checkForValidationErrors} from "../middlewares/validation/checkForValidationErrors";
import { matchedData } from "express-validator";

export async function getUsers(req: Request, res: Response) {

    try {
        const users = await us.getAllUsers();
        res.status(200).json(users).end();
    }
    catch(err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function getUserById(req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams: {uuid: string} = matchedData(req);

        const user = await us.getUserById(queryParams.uuid);
        if (user)
            res.status(200).json(user).end();
        else
            res.status(404).send("User not found.");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function createUser(req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj: IUser = matchedData(req);
        const newUser = await us.createNewUser(bodyObj);

        res.status(201).json(newUser).end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function deleteUserWithId(req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams: {uuid: string} = matchedData(req);
        await us.deleteUserWithId(queryParams.uuid);
        res.status(200).send("User deleted successfully.").end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}