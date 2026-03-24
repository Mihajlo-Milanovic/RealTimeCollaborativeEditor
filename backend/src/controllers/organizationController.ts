import { NextFunction, Request, Response } from "express";
import * as os from "../services/organizationService";
import { matchedData } from "express-validator";
import { checkForValidationErrors } from "../middlewares/validation/checkForValidationErrors";
import { INewOrganization } from "../data/interfaces/IOrganization";
import {OrganizationView} from "../data/types/OrganizationView";
import {UserPrivileges} from "../data/types/UserPrivileges";


export async function getOrganizationByName (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: {name: string} = matchedData(req);
        const result: OrganizationView | null = await os.getOrganizationByName(data.name);
        if (result)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(404).json({
                success: false,
                message: "Organization not found.",
            });
    }
      catch (err) {
        next(err);
    }
}

export async function getOrganizationById(req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: { id: string } = matchedData(req);
        const result: OrganizationView | null = await os.getOrganizationById(data.id);
        if (result)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(404).json({
                success: false,
                message: "Organization not found.",
            });
    }
    catch (err) {
        next(err);
    }
}

export async function createOrganization(req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj = matchedData(req) as INewOrganization;
        const result = await os.createOrganization(bodyObj);
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

export async function updateOrganization(req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data = matchedData(req);
        const result = await os.updateOrganization(
            data.organizationId, {
                name: data.name,
                organizer: data.organizer
            });
        if (!(result instanceof Error))
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(400).json({
                success: false,
                message: result.message,
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
        const data: {id: string, children: Array<string>} = matchedData(req);
        const result: OrganizationView | null = await os.addChildrenByIds(data.id, data.children);
        if (result)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(400).json({
                success: false,
                message: "Can't add children.",
            });
    }
   catch (err) {
        next(err);
    }
}

export async function removeFromChildrenByIds (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: {id: string, children: Array<string>} = matchedData(req);
        const result: OrganizationView | null = await os.removeFromChildrenByIds(data.id, data.children);
       if (result)
           res.status(200).json({
                success: true,
                data: result,
           });
       else
           res.status(404).json({
                success: false,
                message: "Cant remove children.",
           });
    }
   catch (err) {
        next(err);
    }
}

export async function addMembersByIds (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: {
            id: string,
            members: [{
                userId: string,
                role: UserPrivileges
            }]
        } = matchedData(req);

        const map = new Map();
        for (const member of data.members) {
            map.set(member.userId, member.role);
        }
        const result = await os.addMembersByIds(data.id, map as Map<string, UserPrivileges>);
        if (result)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(400).json({
                success: false,
                message: "Can't add members.",
            });
    }
    catch (err) {
        next(err);
    }
}

export async function addMembersByUsername(req: Request, res: Response, next: NextFunction){

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: {
            id: string,
            members: [{
                username: string,
                role: UserPrivileges
            }]
        } = matchedData(req);

        const map = new Map();
        for (const member of data.members) {
            map.set(member.username, member.role);
        }
        const result = await os.addMembersByUsername(data.id, map as Map<string, UserPrivileges>);
        if (result)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(400).json({
                success: false,
                message: "Can't add members.",
            });
    }
    catch (err) {
        next(err);
    }
}

export async function removeFromMembersByIds (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: {id: string, members: Array<string>} = matchedData(req);
        const result: OrganizationView | null = await os.removeFromMembersByIds(data.id, data.members);
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

export async function addProjectionsByIds (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: {id: string, children: Array<string>} = matchedData(req);
        const result: OrganizationView | null = await os.addProjectionsByIds(data.id, data.children);
       if (result)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(404).json({
                success: false,
                message: "Can't add projections.",
            });
    }
    catch (err) {
        next(err);
    }
}

export async function removeFromProjectionsByIds (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: {id: string, children: Array<string>} = matchedData(req);
        const result: OrganizationView | null = await os.removeFromProjectionsByIds(data.id, data.children);
        if (result)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(404).json({
                success: false,
                message: "Can't remove projections.",
            });
    }
    catch (err) {
        next(err);
    }
}

export async function deleteOrganization (req: Request, res: Response, next: NextFunction) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const data: { id: string, userId: string} = matchedData(req);
        const result = await os.deleteOrganization(data.id, data.userId);
        if (result)
            res.status(200).json({
                success: true,
                data: result,
            });
        else
            res.status(404).json({
                success: false,
                message: "Can't delete organization.",
            });
    }
    catch (err) {
        next(err);
    }
}
