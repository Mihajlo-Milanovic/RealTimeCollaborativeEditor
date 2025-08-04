import {IOrganization, SimpleOrganization} from "../data/interfaces/IOrganization";
import Organization from "../data/models/Organization";
import { Types } from "mongoose";
import { deleteFile } from "./fileService"
import {createDirectory, deleteDirectory} from "./directoryService";
import {IDirectory, isIDirectory} from "../data/interfaces/IDirectory";
import Directory from "../data/models/Directory";
import {IUser} from "../data/interfaces/IUser";


export async function getOrganizationByName (orgName: string): Promise<Array<IOrganization> | null> {

    return Organization.findOne({name: orgName});
}

export async function getOrganizationById(orgId: string): Promise<IOrganization | null> {

    return await Organization.findById(orgId).exec();
    //.populate(['files', 'children', 'members', 'organizer'])
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

export async function addMembersByIds (organizationId: string, membersIds: Array<string>): Promise<IOrganization | null> {

    const org: IOrganization | null = await Organization.findById(organizationId);

    if (org) {
        membersIds = [...new Set(
            membersIds.concat(
                org.members.map(member => member.toHexString())
            )
        )];

        org.members = membersIds.map(memberId =>
            new Types.ObjectId(memberId)
        );
        await org.save();
    }
    return org;
}

export async function removeFromMembersByIds (organizationId: string, membersIdsToRemove: Array<string>): Promise<IOrganization | null> {

    const org: IOrganization | null = await Organization.findById(organizationId);

    if (org) {
        const toRemove = new Set(membersIdsToRemove);
        const membersIds = org.members
            .map(member => member.toHexString())
            .filter(el => !toRemove.has(el));

        org.files = membersIds.map(memberId =>
            new Types.ObjectId(memberId)
        );
        await org.save();
    }
    return org;
}

export async function addProjectionsByIds (organizationId: string, projectionsIds: Array<string>): Promise<IOrganization | null> {

    const org: IOrganization | null = await Organization.findById(organizationId).populate('projections').select('projections').exec()

    if (org) {

        const projectionsDict = new Map<string, IDirectory>();

        org.projections.forEach(projection => {
            if (isIDirectory(projection)) {
                projectionsDict.set(projection.name, projection)
            }
        });

        const projections: Array<IDirectory> = await Directory.find({ _id: { $in: projectionsIds } })
                                                                .populate('owner')
                                                                .select('owner');

        for (const projection of projections) {

            const owner = projection.owner as unknown as IUser;

            if (projectionsDict.has(owner.username)) {

               const dir = projectionsDict.get(owner.username)
               if (dir) {
                   dir.children = [...new Set(dir.children.concat(projection._id as Types.ObjectId))];
                   await dir.save();

                   projection.parents = [...new Set(projection.parents.concat(dir._id as Types.ObjectId))];
               }
            }
            else {

               const newNamespace = await createDirectory({
                   name: owner.username,
                   owner: owner.id,
                   children: [projection.id],
                   files:[],
                   parents: [org.id],
               });

               if (newNamespace) {
                   projection.parents.push(newNamespace._id as Types.ObjectId);
                   org.projections.push(newNamespace._id as Types.ObjectId);
               }
            }

           await projection.save();
        }

        await org.save();
    }
    return org;
}

export async function removeFromProjectionsByIds (organizationId: string, projectionsIdsToRemove: Array<string>): Promise<IOrganization | null> {

    const org: IOrganization | null = await Organization.findById(organizationId)
                                                        .populate('projections')
                                                        .select('projections');

    if (org) {

        if (org.projections.length == 0)
            return org;

        const mapOfProjections = new Map<string, IDirectory>();
        for (const projection of org.projections){
            if (isIDirectory(projection)) {
                mapOfProjections.set(projection.name, projection)
            }
        }
        const toRemove = new Set(projectionsIdsToRemove);
        const projectionsToRemove: Array<IDirectory> | null = await Directory.find({ _id: { $in: toRemove }})
                                                                            .populate(['owner', 'parents'])
                                                                            .select(['owner', 'parents']);

        if (projectionsToRemove.length == 0)
            return org;

        const mapOfProjectionsToRemove = new Map< string, Array<IDirectory> >();
        for (const projection of projectionsToRemove) {
            if (isIDirectory(projection)) {
                const name = (projection.owner as unknown as IUser).username;
                if (mapOfProjectionsToRemove.has(name))
                    mapOfProjectionsToRemove.get(name)?.push(projection);
                else
                    mapOfProjectionsToRemove.set(name, [projection]);
            }
        }

        for ( const name_projection of mapOfProjections.entries()){
            const childrenToRemove = mapOfProjectionsToRemove.get(name_projection[0]);
            if (childrenToRemove){
                const forRemoval = new Set(...childrenToRemove.map(dir => dir.id));
                name_projection[1].children.map(childObjId => childObjId.toHexString())
                                            .filter(childId => !forRemoval.has(childId));
                if (name_projection[1].children.length == 0)
                    await deleteDirectory(name_projection[1].id);
                else
                    await name_projection[1].save();
            }
        }

        await org.save();
    }
    return org;
}


export async function deleteOrganization (organizationId: string, applicantId: string) {

    const org: IOrganization | null = await Organization.findById(organizationId)
                                                        .populate(['projections', 'members'])
                                                        .exec();

    const numberOfDeletions = new NumberOfDeletions();

    if (org == null)
        return numberOfDeletions;

    if (org.organizer.toHexString() !== applicantId)
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