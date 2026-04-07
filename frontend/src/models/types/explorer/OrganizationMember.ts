import {OrganizationRole} from "@/models/types/OrganizationRole";
import {UserView} from "@/models/types/UserView";


export type OrganizationMember = UserView & {
    role: OrganizationRole;
};