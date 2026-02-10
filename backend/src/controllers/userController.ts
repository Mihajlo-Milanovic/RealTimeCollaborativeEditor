import { NextFunction, Request, Response } from "express";
import * as us from "../services/userService";
import { INewUser } from "../data/interfaces/IUser";
import { checkForValidationErrors } from "../middlewares/validation/checkForValidationErrors";
import { matchedData } from "express-validator";

export async function createUser(req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj = matchedData(req) as INewUser;

        const result = await us.createNewUser(bodyObj);

        if (result instanceof Error)
            res.status(400).json({
                success: false,
                message: result.message,
            });
        else
            res.status(201).json({
                success: true,
                data: result,
            });
    }
    catch (err) {
        next(err);
    }
}


export async function deleteUserWithId(req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: { id: string } = matchedData(req);

        const result = await us.deleteUserWithId(data.id);

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


export async function getUsers(req: Request, res: Response, next: NextFunction) {

    try {
        const users = await us.getAllUsers();

        res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (err) {
        next(err);
    }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: { id: string } = matchedData(req);

        const result = await us.getUserById(data.id);

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


export async function getUserByEmail(req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: { email: string } = matchedData(req);

        const result = await us.getUserWithEmail(data.email);

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


export async function getUserByVerificationToken(req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: { verificationToken: string } = matchedData(req);

        const result = await us.getUserByVerificationToken(data.verificationToken);

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


export async function verifyUser(req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: { verificationToken: string } = matchedData(req);

        const result = await us.verifyUser(data.verificationToken);

        if (result)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(404).json({
                success: false,
                message: "Invalid or expired token.",
            });
    }
    catch (err) {
        next(err);
    }
}
