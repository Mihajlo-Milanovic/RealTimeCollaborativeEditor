import {PlainResource} from "./PlainResource";
import {IOrganization} from "../interfaces/IOrganization";
import {toUserView, UserView} from "./UserView";
import {IUser} from "../interfaces/IUser";
import {FileView, toFileView} from "./FileView";
import {Types} from "mongoose";
import {IDirectory} from "../interfaces/IDirectory";
import {IFile} from "../interfaces/IFile";
import {DirectoryView, toDirectoryView} from "./DirectoryView";
import {UserPrivileges} from "./UserPrivileges";


export type OrganizationView = PlainResource<IOrganization, "organizer" | "children" | "projections">
    & {
    organizer: UserView,
    children: Array<DirectoryView>,
    projections: Array<DirectoryView>,
    //members: Map<string, string>
    };

export function toOrganizationView(organization: IOrganization): OrganizationView{

    let c: any = [];
    if (organization.children.length > 0) {
        if (!(organization.children[0] instanceof Types.ObjectId))
            c = organization.children.map(c => toDirectoryView(c as unknown as IDirectory));
        else
            c = organization.children;
    }

    let p: any = [];
    if (organization.projections.length > 0) {
        if (!(organization.projections[0] instanceof Types.ObjectId))
            p = organization.projections.map(p => toDirectoryView(p as unknown as IDirectory));
        else
            p = organization.projections;
    }

    let o: UserView = { id: "", username: "", email: "", organizations: new Map<string, UserPrivileges>};
    if (organization.organizer != null) {
        if (!(organization.organizer instanceof Types.ObjectId))
            o = toUserView(organization.organizer as unknown as IUser);
        else
            o.id = organization.organizer._id.toHexString();
    }

    return {
        id: organization._id.toHexString(),
        name: organization.name,
        organizer: o,
        children: c,
        projections: p,
        members: organization.members,//TODO: revisit
    }
}