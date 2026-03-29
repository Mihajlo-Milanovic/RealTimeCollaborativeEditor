import {OrganizationRole} from "@/app/core/types/OrganizationRole";
import {UserView} from "@/app/core/types/UserView";


export type OrganizationMember = UserView & {
    role: OrganizationRole;
};