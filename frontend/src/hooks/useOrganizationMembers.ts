import { useState, useCallback, useEffect } from "react";
import { getRequestSingle, putRequest } from "@/core/api/serverRequests/methods";
import {OrganizationView} from "@/core/types/OrganizationView";
import {OrganizationMember} from "@/core/types/OrganizationMember";
import {OrganizationRole} from "@/core/types/OrganizationRole";
import {UserView} from "@/core/types/UserView";


export function useOrganizationMembers(organization: OrganizationView | null, currentUserId?: string) {
    const [members, setMembers] = useState<OrganizationMember[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadMembers = useCallback(async (org: OrganizationView) => {
        setIsLoading(true);
        try {
            const orgDetailsRes = await getRequestSingle(`organizations/${org.id}`);
            if (!orgDetailsRes.ok) throw new Error("Could not fetch organization details");

            const orgDetailsPayload = await orgDetailsRes.json();
            const orgDetails = (orgDetailsPayload?.data ?? null) as OrganizationView | null;

            if (orgDetails) {
                let orgMemMap: Map<string, OrganizationRole>;
                if (orgDetails.members instanceof Map) {
                    orgMemMap = orgDetails.members as Map<string, OrganizationRole>;
                } else if (orgDetails.members) {
                    orgMemMap = new Map(Object.entries(orgDetails.members));
                } else {
                    orgMemMap = new Map();
                }

                if (orgMemMap.size) {
                    const params = new URLSearchParams();
                    orgMemMap.keys().forEach(id => params.append('userIds', id.toString()));

                    const urlWithParams = `users/?${params.toString()}`;
                    const userRes = await getRequestSingle(urlWithParams);
                    if (userRes.ok) {
                        const payload = await userRes.json();
                        const users = payload?.data as UserView[] | null;
                        if (users != null) {
                            const mappedMembers = users.map(u => ({
                                ...u,
                                role: orgMemMap.get(u.id) || "viewer"
                            } as OrganizationMember));
                            setMembers(mappedMembers);
                            return;
                        }
                    }
                }
            }
            setMembers([]);
        } catch (error) {
            console.error("Error loading members:", error);
            setMembers([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (organization) {
            void loadMembers(organization);
        } else {
            setMembers([]);
        }
    }, [organization, loadMembers]);

    const changeRole = async (memberId: string, role: OrganizationRole) => {
        if (!organization) return false;
        const res = await putRequest(`organizations/${organization.id}/addMembers`, {
            members: [{ userId: memberId, role }],
        });
        if (res.ok) {
            await loadMembers(organization);
            return true;
        }
        return false;
    };

    const removeMember = async (member: OrganizationMember) => {
        if (!organization || !currentUserId) return false;
        const confirmed = confirm(`Remove ${member.username} from ${organization.name}?`);
        if (!confirmed) return false;

        const res = await putRequest(`organizations/${organization.id}/removeMembers`, {
            members: [member.id],
            applicantId: currentUserId,
        });
        if (res.ok) {
            await loadMembers(organization);
            return true;
        }
        return false;
    };

    const addMemberByUsername = async (username: string, role: OrganizationRole) => {
        if (!organization) return false;
        const res = await putRequest(`organizations/${organization.id}/addMembersByUsername`, {
            members: [{ username, role }],
        });
        if (res.ok) {
            await loadMembers(organization);
            return true;
        }
        return false;
    };

    return {
        members,
        isLoading,
        loadMembers,
        changeRole,
        removeMember,
        addMemberByUsername
    };
}
