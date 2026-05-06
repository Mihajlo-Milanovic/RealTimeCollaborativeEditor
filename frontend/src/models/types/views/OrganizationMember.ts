import {OrganizationRole} from "@/models/types/OrganizationRole";
import {UserView} from "@/models/types/views/UserView";


export type OrganizationMember = UserView & {
    role: OrganizationRole;
};