import {OrganizationRole} from "@/core/types/OrganizationRole";
import {UserView} from "@/core/types/UserView";


export type OrganizationMember = UserView & {
    role: OrganizationRole;
};