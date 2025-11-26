import { Request, Response } from "express";
import * as us from "../services/userService";
import {isIUser, SimpleUser} from "../data/interfaces/IUser";
import {checkForValidationErrors} from "../middlewares/validation/checkForValidationErrors";
import {matchedData} from "express-validator";

export async function createUser(req: Request, res: Response) {

    if (checkForValidationErrors(req, res)) {
        return;
    }

    try {
        const user: SimpleUser = {...matchedData(req)};

        const newUser = await us.createNewUser(user);

        //TODO: proveriti ovo
        if (isIUser(newUser))
            res.status(201).json(newUser).end();
        else
            res.status(500).send("Internal server error occurred.").end();

    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function deleteUserWithId(req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const { uuid } = matchedData(req);
        await us.deleteUserWithId(uuid);
        res.status(200).send("User deleted successfully.").end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

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
        const { uuid } = matchedData(req);

        const user = await us.getUserById(uuid);
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
        const { email } = matchedData(req);

        const user = await us.getUserWithEmail(email);
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
        const { verificationToken } = matchedData(req);

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

export async function verifyUser(req: Request, res: Response) {

    if (checkForValidationErrors(req, res)) {
        return;
    }

    try {
        const { verificationToken } = matchedData(req);

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

