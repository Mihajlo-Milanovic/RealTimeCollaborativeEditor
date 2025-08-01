import { Request, Response } from "express";
import * as us from "../services/userService";
import { createDirectory } from "../services/directoryService";
import {isIUser, IUser} from "../data/interfaces/IUser";
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

export async function getUserByEmail(req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams: { email: string } = matchedData(req);

        const user = await us.getUserWithEmail(queryParams.email);
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

export async function getUserByVerificationToken(req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        // const queryParams: { token: string } = matchedData(req); ovom linijom mi daje undefined za token!
        const verificationToken = req.query.verificationToken as string;
        //console.log("Token je: ", verificationToken);

        const user = await us.getUserByVerificationToken(verificationToken);
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

    if (checkForValidationErrors(req, res)) {
        return;
    }

    try {
        const bodyObj: IUser = matchedData(req);

        const result = await us.createNewUser(bodyObj);

        if (isIUser(result))
            res.status(201).json(result).end();
        else {
            console.log(result.message);
            res.status(403).json({message: result.message});
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function verifyUser(req: Request, res: Response) {

    if (checkForValidationErrors(req, res)) {
        return;
    }

    try {
        //const queryParams: { verificationToken: string } = matchedData(req); ovom linijom mi daje undefined za token!
        const verificationToken = req.query.verificationToken as string;

        const user = await us.verifyUser(verificationToken);

        if (user)
            res.status(200).json({ message: "User verified successfully.", user }).end();
        else
            res.status(404).send("Invalid or expired token.").end();

    } catch (err) {
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