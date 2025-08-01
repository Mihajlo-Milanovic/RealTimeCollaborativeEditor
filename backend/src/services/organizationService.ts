import {IOrganization, OverrideType, SimpleOrganization} from "../data/interfaces/IOrganization";
import Organization from "../data/models/Organization";
import { Types } from "mongoose";
import { deleteFile } from "./fileService"
import {deleteDirectory} from "./directoryService";
import {IDirectory, isIDirectory} from "../data/interfaces/IDirectory";


export async function getOrganizationByName (orgName: string): Promise<Array<IOrganization> | null> {

    return Organization.findOne({name: orgName});
}

export async function getOrganizationPopulated(orgId: string): Promise<IOrganization | null> {

    return await Organization.findById(orgId).populate(['files', 'children', 'members', 'organizer']).exec();
}

export async function createOrganization (organization: SimpleOrganization): Promise<IOrganization | null> {

    return await Organization.create(organization);
}

export async function addChildrenByIds (organizationId: string, childrenIds: Array<string>): Promise<IOrganization | null> {

    const org: IOrganization | null = await Organization.findById(organizationId);

    if (org) {
        childrenIds = [...new Set(
            childrenIds.concat(
                org.children.map(child => child.toHexString())
            )
        )];

        org.children = childrenIds.map(childId =>
            new Types.ObjectId(childId)
        );
        await org.save();
    }
    return org;
}

export async function removeFromChildrenByIds (organizationId: string, childrenIdsToRemove: Array<string>): Promise<IOrganization | null> {

    const org: IOrganization | null = await Organization.findById(organizationId);

    if (org) {
        const toRemove = new Set(childrenIdsToRemove);
        const childrenIds = org.children
            .map(child => child.toHexString())
            .filter(el => !toRemove.has(el));

        org.children = childrenIds.map(childId =>
            new Types.ObjectId(childId)
        );
        await org.save();
    }
    return org;
}

export async function addFilesByIds (organizationId: string, filesIds: Array<string>): Promise<IOrganization | null> {

    const org: IOrganization | null = await Organization.findById(organizationId);

    if (org) {
        filesIds = [...new Set(
            filesIds.concat(
                org.files.map(file => file.toHexString())
            )
        )];

        org.files = filesIds.map(fileId =>
            new Types.ObjectId(fileId)
        );
        await org.save();
    }
    return org;
}

export async function removeFromFilesByIds (organizationId: string, filesIdsToRemove: Array<string>): Promise<IOrganization | null> {

    const org: IOrganization | null = await Organization.findById(organizationId);

    if (org) {
        const toRemove = new Set(filesIdsToRemove);
        const filesIds = org.files
            .map(file => file.toHexString())
            .filter(el => !toRemove.has(el));

        org.files = filesIds.map(fileId =>
            new Types.ObjectId(fileId)
        );
        await org.save();
    }
    return org;
}

export async function deleteOrganization (organizationId: string, organizerId: string) {

    const org: IOrganization | null = await Organization.findById(organizationId)
                                                        .populate(['projections', 'members'])
                                                        .exec();

    const numberOfDeletions = new NumberOfDeletions();

    if (org == null)
        return numberOfDeletions;

    if (org.organizer.toHexString() !== organizerId)
        return new Error('Only organizer can delete the organization.');


    for(const f of org.files) {
        await deleteFile(f.toHexString());
        numberOfDeletions.filesDeleted++;
    }

    for(const c of org.children) {
        numberOfDeletions.accumulate( await deleteDirectory(c.toHexString()) );
    }

    for (const p of org.projections){
        if(isIDirectory(p)){
            p.parents = p.parents.filter(el => el.toHexString() !== organizationId);
            if(p.parents.length == 0) {
                numberOfDeletions.accumulate( await deleteDirectory(p.id) );
            }
        }
    }

    return numberOfDeletions;
}