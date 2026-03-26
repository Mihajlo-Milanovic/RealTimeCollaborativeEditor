import {OrganizationMember} from "@/core/types/OrganizationMember";


export type TMemberItem = {
    member: OrganizationMember;
    showChangeRoleAndRemove: boolean;
    onChangeRole: (member: OrganizationMember) => void;
    onRemove: (member: OrganizationMember) => void;
}