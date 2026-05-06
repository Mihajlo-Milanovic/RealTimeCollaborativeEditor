import {OrganizationMember} from "@/models/types/views/OrganizationMember";


export type TMemberItem = {
    member: OrganizationMember;
    showChangeRoleAndRemove: boolean;
    onChangeRole: (member: OrganizationMember) => void;
    onRemove: (member: OrganizationMember) => void;
}