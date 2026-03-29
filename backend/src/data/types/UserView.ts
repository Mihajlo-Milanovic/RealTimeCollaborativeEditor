import {PlainResource} from "./PlainResource";
import {IUser} from "../interfaces/IUser";
import {Types} from "mongoose";
import {toDirectoryView} from "./DirectoryView";
import {IDirectory} from "../interfaces/IDirectory";
import {OrganizationView} from "./OrganizationView";
import {IOrganization} from "../interfaces/IOrganization";


export type UserView = PlainResource<IUser, "password" | "verificationToken">;

export function toUserView(user: IUser): UserView{

    return {
        id: user._id.toHexString(),
        username: user.username,
        email: user.email,
        organizations: user.organizations,
        verified: user.verified,
    }
}