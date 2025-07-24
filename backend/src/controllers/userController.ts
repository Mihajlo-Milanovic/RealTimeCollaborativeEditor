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

export async function getUserByEmail(req: Request, res: Response) {
    try {
        const email = req.query.email as string;

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
    try {
        const token = req.query.verificationToken as string;

        const user = await us.getUserByVerificationToken(token);
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
        //console.log("telo: ", req.body);
        //const bodyObj: IUser = matchedData(req);

        // ZA SAD !!!! ovako sam jer sam crko debagirajuci + se zurim, ce se dogovorimo
        const result = await us.createNewUser(req.body);

        if (result instanceof Error) {
            console.log(result.message);
            res.status(403).json({message: result.message});
            return;
        }

        res.status(201).json(result).end();
    }
    catch (err) {
        console.log((err as Error).message);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function verifyUser(req: Request, res: Response) {
  try {
    const token = req.query.verificationToken as string;

    if (!token) { 
      res.status(400).send("Verification token is required.");
      return;
    }

    const user = await us.verifyUser(token);

    if (!user) {
      res.status(404).send("Invalid or expired token.");
      return;
    }

    res.status(200).json({ message: "User verified successfully.", user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
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