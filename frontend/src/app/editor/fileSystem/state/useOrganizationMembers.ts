import { useState, useCallback, useEffect } from "react";
import { useHocuspocusProvider } from "@hocuspocus/provider-react";
import { getRequestSingle, putRequest } from "../../../api/serverRequests/methods";
import {OrganizationView} from "../../../../models/types/views/OrganizationView";
import {OrganizationMember} from "../../../../models/types/views/OrganizationMember";
import {OrganizationRole} from "../../../../models/types/OrganizationRole";
import {UserView} from "../../../../models/types/views/UserView";
import {membersStore} from "../../../../store/members";


export function useOrganizationMembers(organization: OrganizationView | null, currentUserId?: string) {
    const [members, setMembers] = useState<OrganizationMember[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Soba organizacije čiji se članovi prikazuju (dijalog je uvek unutar
    // <HocuspocusRoom name={organization.id}>). Kroz njen shared dokument se
    // backendom potvrđene uloge objavljuju svim klijentima organizacije.
    const provider = useHocuspocusProvider();

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

                // Objavi sveže (backendom potvrđeno) stanje uloga u shared
                // Y.Map — Hocuspocus ga prosledi svim klijentima u sobi.
                membersStore.publish(provider.document, orgMemMap);

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
    }, [provider.document]);

    useEffect(() => {
        if (organization) {
            void loadMembers(organization);
        } else {
            setMembers([]);
        }
    }, [organization, loadMembers]);

    // Realtime: kada bilo koji klijent objavi promenu uloga u shared mapu,
    // osveži listu članova sa backenda (izvor istine) — lista u otvorenom
    // dijalogu se ažurira bez refresh-a.
    useEffect(() => {
        if (!organization) return;

        return membersStore.subscribe(provider.document, () => {
            void loadMembers(organization);
        });
    }, [organization, provider.document, loadMembers]);

    const changeRole = async (memberId: string, role: OrganizationRole) => {
        if (!organization || !currentUserId) return false;
        // "admin" se ne može dodeliti — backend ovo takođe odbija (autoritet),
        // ovde samo štedimo uzaludan zahtev.
        if (role === "admin") return false;
        const res = await putRequest(`organizations/${organization.id}/addMembers`, {
            members: [{ userId: memberId, role }],
            applicantId: currentUserId,
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
        if (!organization || !currentUserId) return false;
        if (role === "admin") return false;
        const res = await putRequest(`organizations/${organization.id}/addMembersByUsername`, {
            members: [{ username, role }],
            applicantId: currentUserId,
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
