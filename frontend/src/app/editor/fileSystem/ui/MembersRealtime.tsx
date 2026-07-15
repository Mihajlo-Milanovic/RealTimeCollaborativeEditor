"use client";

import {useEffect, useRef} from "react";
import {useHocuspocusProvider} from "@hocuspocus/provider-react";
import {OrganizationView} from "../../../../models/types/views/OrganizationView";
import {OrganizationRole} from "../../../../models/types/OrganizationRole";
import {membersStore} from "../../../../store/members";

type TMembersRealtime = {
    organization: OrganizationView | null;
    onMembersChangedAction: (orgId: string, roles: Map<string, OrganizationRole>) => void;
};

/**
 * Headless subscriber: u sobi IZABRANE organizacije posmatra shared Y.Map
 * "members" (uloge koje je backend potvrdio, objavljene iz useOrganizationMembers)
 * i na svaku promenu javi explorer-u novo stanje uloga. Explorer zatim ažurira
 * selectedOrganization, a postojeći efekat u useOrganizationExplorer upiše novu
 * ulogu trenutnog korisnika u accessStore — editor i dugmad se odmah prilagode.
 *
 * Ne renderuje ništa; mora biti unutar <HocuspocusRoom> sobe organizacije.
 */
export default function MembersRealtime(
    {
        organization,
        onMembersChangedAction,
    }: TMembersRealtime
) {

    const provider = useHocuspocusProvider();

    // ref da observer uvek zove aktuelni callback bez ponovnog subscribe-a
    const onChangedRef = useRef(onMembersChangedAction);
    onChangedRef.current = onMembersChangedAction;

    const organizationId = organization?.id ?? null;

    useEffect(() => {
        if (!organizationId) return;

        return membersStore.subscribe(provider.document, () => {
            onChangedRef.current(
                organizationId,
                membersStore.getRoles(provider.document)
            );
        });
    }, [organizationId, provider.document]);

    return null;
}
