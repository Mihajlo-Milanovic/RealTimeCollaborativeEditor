import { Request, Response } from 'express';
import * as os from "../services/organizationService";
import { matchedData } from "express-validator";
import { checkForValidationErrors } from "../middlewares/validation/checkForValidationErrors";
import {SimpleOrganization} from "../data/interfaces/IOrganization";


export async function getOrganizationByName (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams = matchedData(req);
        const org = await os.getOrganizationByName(queryParams.orgName);
        if (org)
            res.status(200).json(org).end();
        else
            res.status(404).send("Organization not found.").end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function getOrganizationById (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams = matchedData(req);
        const org = await os.getOrganizationById(queryParams.organizationId);
        if (org)
            res.status(200).json(org).end();
        else
            res.status(404).send("Organization not found.").end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}


export async function createOrganization(req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj = matchedData(req) as SimpleOrganization;
        const org = await os.createOrganization(bodyObj);
        if (org)
            res.status(200).json(org).end();
        else
            res.status(404).send("Organization could not be made.").end();
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
        const bodyObj: {organizationId: string, children: Array<string>} = matchedData(req);
        const org = await os.addChildrenByIds(bodyObj.organizationId, bodyObj.children);
        if (org)
            res.status(204).end();
        else
            res.status(404).send("Organization not found.").end();
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
        const bodyObj: {organizationId: string, children: Array<string>} = matchedData(req);
        const org = await os.removeFromChildrenByIds(bodyObj.organizationId, bodyObj.children);
        if (org)
            res.status(204).end();
        else
            res.status(404).send("Organization not found.").end();
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
        const bodyObj: {organizationId: string, files: Array<string>} = matchedData(req);
        const org = await os.addFilesByIds(bodyObj.organizationId, bodyObj.files);
        if (org)
            res.status(204).end();
        else
            res.status(404).send("Organization not found.").end();
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
        const bodyObj: {organizationId: string, files: Array<string>} = matchedData(req);
        const org = await os.removeFromFilesByIds(bodyObj.organizationId, bodyObj.files);
        if (org)
            res.status(204).end();
        else
            res.status(404).send("Organization not found.").end();
    }
    catch (err){
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function addMembersByIds (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj: {organizationId: string, members: Array<string>} = matchedData(req);
        const org = await os.addMembersByIds(bodyObj.organizationId, bodyObj.members);
        if (org)
            res.status(204).end();
        else
            res.status(404).send("Organization not found.").end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function removeFromMembersByIds (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj: {organizationId: string, members: Array<string>} = matchedData(req);
        const org = await os.removeFromMembersByIds(bodyObj.organizationId, bodyObj.members);
        if (org)
            res.status(204).end();
        else
            res.status(404).send("Organization not found.").end();
    }
    catch (err){
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function addProjectionsByIds (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj: {organizationId: string, projections: Array<string>} = matchedData(req);
        const org = await os.addProjectionsByIds(bodyObj.organizationId, bodyObj.projections);
        if (org)
            res.status(204).end();
        else
            res.status(404).send("Organization not found.").end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}

export async function removeFromProjectionsByIds (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const bodyObj: {organizationId: string, projections: Array<string>} = matchedData(req);
        const org = await os.removeFromProjectionsByIds(bodyObj.organizationId, bodyObj.projections);
        if (org)
            res.status(204).end();
        else
            res.status(404).send("Organization not found.").end();
    }
    catch (err){
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}


export async function deleteOrganization (req: Request, res: Response) {

    if (checkForValidationErrors(req, res))
        return;

    try {
        const queryParams: { organizationId: string, applicantId: string} = matchedData(req);
        const result = await os.deleteOrganization(queryParams.organizationId,
                                                                            queryParams.applicantId);
        res.status(200).json(result).end();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error occurred.").end();
    }
}