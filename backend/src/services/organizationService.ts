import {IOrganization, INewOrganization} from "../data/interfaces/IOrganization";
import Organization from "../data/dao/OrganizationSchema";
import User from "../data/dao/UserSchema";
import {Types} from "mongoose";
import {deleteFile} from "./fileService"
import {createDirectory, deleteDirectory} from "./directoryService";
import {IDirectory} from "../data/interfaces/IDirectory";
import Directory from "../data/dao/DirectorySchema";
import {IUser} from "../data/interfaces/IUser";
import {NumberOfDeletions} from "../data/classes/NumberOfDeletions";
import {toOrganizationView} from "../data/types/OrganizationView";
import {UserPrivileges} from "../data/types/UserPrivileges";


export async function getOrganizationsByNames(orgNames: Array<string>) {

    const organizations = await Organization.find({name: {$in: orgNames}})
        .populate(["children", "projections", "organizer"])
        .exec();

    if (!organizations)
        return null;
    else
        return organizations.map(o => toOrganizationView(o));
}

export async function getOrganizationById(orgId: string) {

    const org: IOrganization | null = await Organization.findById(orgId)
        .populate(["children", "projections", "organizer"])
        .exec();

    if (org == null)
        return null;
    else
        return toOrganizationView(org);
}

export async function createOrganization(organization: INewOrganization) {

    const user: IUser | null = await User.findById(organization.organizer).exec();
    if (user == null)
        return Error('User not found.');

    const m = new Map<string, UserPrivileges>();
    m.set(user.id, 'admin');

    const o = {
        name: organization.name,
        organizer: user,
        members: m,
        children: [],
        projections: [],
    }

    const org: IOrganization | null = await Organization.create(o);

    if (org == null)
        return Error("Couldn't create organization.");

    user.organizations.set(o.name, 'admin');
    await user.save();

    await org.populate(["children", "projections", "organizer"]);
    return toOrganizationView(org);
}

export async function updateOrganization(organizationId: string, organizationUpdate: INewOrganization) {

    if (organizationUpdate.name != "") {
        const organization = await Organization.findOne({name: organizationUpdate.name}).exec();
        if (organization != null)
            return Error('Organization with this name already exists.');
    }
    const org = await Organization.findById(organizationId).exec();

    if (org == null)
        return Error('Organization not found.');

    if (organizationUpdate.name != "")
        org.name = organizationUpdate.name;
    if (organizationUpdate.organizer.length > 0) {
        const newAdmin = await User.findById(organizationUpdate.organizer).exec();
        if (newAdmin != null) {
            newAdmin.organizations.set(org.name, 'admin')
            await newAdmin.save();
            org.organizer = newAdmin._id;
        }
    }
    await org.save();
    await org.populate(["children", "projections", "organizer"]);
    return toOrganizationView(org);

}

export async function addChildrenByIds(organizationId: string, childrenIds: Array<string>) {

    const org: IOrganization | null = await Organization.findById(organizationId)
        .exec();

    if (org != null) {
        childrenIds = [...new Set(
            childrenIds.concat(
                org.children.map(child => child.toHexString())
            )
        )];

        org.children = childrenIds.map(childId =>
            new Types.ObjectId(childId)
        );
        await org.save();

        await org.populate(["children", "projections", "organizer"]);
        return toOrganizationView(org);
    }
    return null;
}

export async function removeFromChildrenByIds(organizationId: string, childrenIdsToRemove: Array<string>) {

    const org: IOrganization | null = await Organization.findById(organizationId);

    if (org != null) {
        const toRemove = new Set(childrenIdsToRemove);
        const childrenIds = org.children
            .map(child => child.toHexString())
            .filter(el => !toRemove.has(el));

        org.children = childrenIds.map(childId =>
            new Types.ObjectId(childId)
        );
        await org.save();

        await org.populate(["children", "projections", "organizer"]);
        return toOrganizationView(org);
    }
    return null;
}

export async function addMembersByIds(organizationId: string, membersIdsAndPrivileges: Map<string, UserPrivileges>) {

    const org: IOrganization | null = await Organization.findById(organizationId)
        .populate(["children", "projections", "organizer"])
        .exec();

    if (org != null) {

        const users: IUser[] | null = await User.find({_id: {$in: [...membersIdsAndPrivileges.keys()]}}).exec();
        if (users != null) {
            for (const u of users) {
                org.members.set(u.id, membersIdsAndPrivileges.get(u.id) as UserPrivileges);
                u.organizations.set(org.name, membersIdsAndPrivileges.get(u.id) as UserPrivileges);
                await u.save();
            }
        }
        await org.save()

        return toOrganizationView(org);
    }

    return null;
}

export async function addMembersByUsername(organizationId: string, usernamesAndRoles: Map<string, UserPrivileges>) {
    const org: IOrganization | null = await Organization.findById(organizationId)
        .populate(["children", "projections", "organizer"])
        .exec();

    if (org != null) {

        const users: IUser[] | null = await User.find({username: {$in: [...usernamesAndRoles.keys()]}}).exec();
        if (users != null) {
            for (const u of users) {
                org.members.set(u.id, usernamesAndRoles.get(u.username) as UserPrivileges);
                u.organizations.set(org.name, usernamesAndRoles.get(u.username) as UserPrivileges);
                await u.save();
            }
        }
        await org.save()

        return toOrganizationView(org);
    }

    return null;
}

export async function removeFromMembersByIds(organizationId: string, membersIdsToRemove: Array<string>) {

    const org: IOrganization | null = await Organization.findById(organizationId)
        .exec();

    if (org != null) {

        const users: IUser[] | null = await User.find({_id: {$in: membersIdsToRemove}}).exec();
        if (users != null) {
            for (const u of users) {
                org.members.delete(u.id);
                u.organizations.delete(org.name);
                await u.save();
            }
        }

        await org.save();

        await org.populate(["children", "projections", "organizer"]);

        return toOrganizationView(org);
    }

    return null;
}

export async function addProjectionsByIds(organizationId: string, projectionsIds: Array<string>) {

    const org: IOrganization | null = await Organization.findById(organizationId)
        .populate(["children", "projections", "organizer"])
        .exec();

    if (org == null)
        return null;

    const projectionsDict = new Map<string, IDirectory>();

    org.projections.forEach(projection => {
        const proj = projection as unknown as IDirectory;
        projectionsDict.set(proj.name, proj);
    });

    const projections: Array<IDirectory> = await Directory.find({_id: {$in: projectionsIds}})
        .populate('owner')
        .exec();

    for (const projection of projections) {

        const owner = projection.owner as unknown as IUser;

        if (projectionsDict.has(owner.username)) {

            const dir = projectionsDict.get(owner.username);

            if (dir) {
                dir.children = [...new Set(dir.children.concat(projection._id as Types.ObjectId))];
                await dir.save();

                projection.parents = [...new Set(projection.parents.concat(dir._id as Types.ObjectId))];
                await projection.save();
            }
        } else {

            const newNamespace = await createDirectory({
                name: owner.username,
                owner: owner.id,

                parents: [org.id],
            });

            if (newNamespace != null) {

                await addChildrenByIds(newNamespace.id, [projection.id]);
                projection.parents.push(new Types.ObjectId(newNamespace.id));
                org.projections.push(new Types.ObjectId(newNamespace.id));
            }
        }

        await projection.save();
    }

    await org.save();

    return toOrganizationView(org);
}

// export async function removeFromProjectionsByIds(organizationId: string, projectionsIdsToRemove: Array<string>) {
//
//     const org: IOrganization | null = await Organization.findById(organizationId)
//         .populate('projections')
//         .exec();
//
//     if (org == null)
//         return null;
//
//     if (org.projections.length == 0){
//         await org.populate(["children", "projections", "organizer"]);
//         return toOrganizationView(org);
//     }
//
//     const mapOfProjections = new Map<string, IDirectory>();
//     for (const projection of org.projections) {
//         const proj = projection as unknown as IDirectory;
//         mapOfProjections.set(proj.name, proj)
//     }
//
//     const toRemove = new Set(projectionsIdsToRemove);
//     const projectionsToRemove: Array<IDirectory> | null = await Directory.find({_id: {$in: [...toRemove]}})
//         .populate(['owner', 'parents'])
//         .exec();
//         // .select(['owner', 'parents']);
//
//     if (projectionsToRemove.length == 0)
//         return toOrganizationView(org);
//
//     const mapOfProjectionsToRemove = new Map<string, Array<IDirectory>>();
//     for (const projection of projectionsToRemove) {
//         const proj = projection as unknown as IDirectory;
//         const name = (proj.owner as unknown as IUser).username;
//         if (mapOfProjectionsToRemove.has(name))
//             mapOfProjectionsToRemove.get(name)?.push(proj);
//         else
//             mapOfProjectionsToRemove.set(name, [proj]);
//     }
//
//     for (const name_projection of mapOfProjections.entries()) {
//         const childrenToRemove = mapOfProjectionsToRemove.get(name_projection[0]);
//         if (childrenToRemove) {
//             const forRemoval = new Set(...childrenToRemove.map(dir => dir.id));
//             name_projection[1].children.map(childObjId => childObjId.toHexString())
//                 .filter(childId => !forRemoval.has(childId));
//             if (name_projection[1].children.length == 0)
//                 await deleteDirectory(name_projection[1].id);
//             else
//                 await name_projection[1].save();
//         }
//     }
//
//     await org.save();
//     await org.populate(["children", "projections", "organizer"]);
//     return toOrganizationView(org);
// }

export async function removeFromProjectionsByIds(
    organizationId: string,
    projectionsIdsToRemove: Array<string>
) {
    const org: IOrganization | null = await Organization.findById(organizationId)
        .populate({
            path: "projections",
            populate: {
                path: "owner",
            },
        })
        .exec();

    if (!org) {
        return null;
    }

    if (!projectionsIdsToRemove || projectionsIdsToRemove.length === 0) {
        await org.populate(["children", "projections", "organizer"]);
        return toOrganizationView(org);
    }

    const idsToRemove = new Set(projectionsIdsToRemove.map((id) => id.toString()));

    if (!org.projections || org.projections.length === 0) {
        await org.populate(["children", "projections", "organizer"]);
        return toOrganizationView(org);
    }

    const mapOfProjections = new Map<string, IDirectory>();

    for (const projection of org.projections as unknown as IDirectory[]) {
        const proj = projection as IDirectory;
        const owner = proj.owner as IUser | Types.ObjectId | string;

        let username: string | null = null;

        if (owner && typeof owner === "object" && "username" in owner) {
            username = (owner as IUser).username;
        }

        if (username) {
            mapOfProjections.set(username, proj);
        }
    }

    const projectionsToRemove = await Directory.find({
        _id: {$in: projectionsIdsToRemove},
    })
        .populate(["owner", "parents"])
        .exec();

    if (projectionsToRemove.length === 0) {
        await org.populate(["children", "projections", "organizer"]);
        return toOrganizationView(org);
    }

    const mapOfProjectionsToRemove = new Map<string, IDirectory[]>();

    for (const projection of projectionsToRemove) {
        const proj = projection as IDirectory;
        const owner = proj.owner as IUser | Types.ObjectId | string;

        let username: string | null = null;

        if (owner && typeof owner === "object" && "username" in owner) {
            username = (owner as IUser).username;
        }

        if (!username) continue;

        if (!mapOfProjectionsToRemove.has(username)) {
            mapOfProjectionsToRemove.set(username, []);
        }

        mapOfProjectionsToRemove.get(username)!.push(proj);
    }

    for (const [username, projectionDir] of mapOfProjections.entries()) {
        const childrenToRemove = mapOfProjectionsToRemove.get(username);

        if (!childrenToRemove) {
            continue;
        }

        const childIdsToRemove = new Set(
            childrenToRemove.map((dir) => dir._id.toString())
        );

        projectionDir.children = (projectionDir.children || []).filter((child: any) => {
            const childId = child?._id?.toString?.() ?? child?.toString?.();
            return childId && !childIdsToRemove.has(childId);
        }) as any;

        if (projectionDir.children.length === 0) {
            await deleteDirectory(projectionDir._id.toString());
        } else {
            await projectionDir.save();
        }
    }

    org.projections = (org.projections as any[]).filter((projection: any) => {
        const projectionId = projection?._id?.toString?.() ?? projection?.toString?.();
        return projectionId && !idsToRemove.has(projectionId);
    }) as any;

    await org.save();
    await org.populate(["children", "projections", "organizer"]);

    return toOrganizationView(org);
}

export async function deleteOrganization(organizationId: string, applicantId: string) {

    const org = await Organization.findById(organizationId)
        .populate(['projections', 'members'])
        .exec() as Omit<IOrganization, "projections"> & {
        projections: Array<IDirectory>,
        // members: Array<IUser>
    } | null;

    const numberOfDeletions = new NumberOfDeletions();

    if (org == null)
        return numberOfDeletions;

    const memberMap = new Map<string, UserPrivileges>(org.members);
    if (memberMap.get(applicantId) !== "admin")
        return new Error('Only admin can delete the organization.');

    for (const c of org.children) {
        numberOfDeletions.accumulate(await deleteDirectory(c.toHexString()));
    }

    for (const p of org.projections) {
        p.parents = p.parents.filter(el => el.toHexString() !== organizationId);
        // if(p.parents.length == 0) {
        //     numberOfDeletions.accumulate( await deleteDirectory(p.id) );
        // }
    }

    await Organization.findByIdAndDelete(organizationId);

    return numberOfDeletions;
}