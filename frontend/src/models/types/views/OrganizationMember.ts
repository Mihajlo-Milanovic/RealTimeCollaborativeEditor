import {OrganizationRole} from "../OrganizationRole";
import {UserView} from "./UserView";


export type OrganizationMember = UserView & {
    role: OrganizationRole;
};