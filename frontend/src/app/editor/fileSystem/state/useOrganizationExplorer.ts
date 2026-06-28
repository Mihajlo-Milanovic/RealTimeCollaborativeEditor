import {useEffect, useState} from "react";
import {OrganizationView} from "../../../../models/types/views/OrganizationView";
import {apiClient} from "../../../../lib/apiClient";
import {user} from "../../../../store/user";
import {useAccessStore} from "../../../../lib/access/accessStore";
import {OrganizationRole} from "../../../../models/types/OrganizationRole";


export function useOrganizationExplorer(userId: string) {

    const [isOpen, setIsOpen] = useState(false);
    const [organizations, setOrganizations] = useState<OrganizationView[]>([]);
    const [visibleOrganizations, setVisibleOrganizations] = useState<OrganizationView[]>([]);
    const [selectedOrganization, setSelectedOrganization] = useState<OrganizationView | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [queryString, setQueryString] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [fsRoom, setFsRoom] = useState<string>(user.id);


    const fetchOrganizations = async () => {
        if (!userId) return;

        setIsLoading(true);
        
        const memberships = await apiClient.explorer.getOrganizationsForUser(userId);

        if (!memberships.size) {
            setOrganizations([]);
            setVisibleOrganizations([]);
            setIsLoading(false);
            return;
        }

        //Filter by name to reduce the number of organizations for fetching before calling API
        // const names = filterOrganizations(memberships.keys().toArray());
        const names = memberships.keys().toArray();

        const organizations = await apiClient.explorer.getOrganizationsByNames(names);

        const sortedOrganizations = organizations.sort((a, b) => a.name.localeCompare(b.name));

        setOrganizations(sortedOrganizations);
        setVisibleOrganizations(sortedOrganizations);
        setIsLoading(false);
    }

    const filterOrganizations = (organizations: OrganizationView[]) =>{
        if (isSearchOpen) {
            const normalized = queryString.trim().toLowerCase();
            if (normalized)
                return organizations.filter((org) => org.name.toLowerCase().includes(normalized));
        }
        return organizations;
    }

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);

        // if (!isSearchOpen) setQueryString("");
    }

    const selectOrganization= async (organization: OrganizationView | null) => {
        if (organization == null || selectedOrganization?.id == organization.id) {
            setSelectedOrganization(null);
        }
        else {
            setSelectedOrganization(organization);
        }
    }

    const toggleOrganizationExplorer = async () => {
        setIsOpen(!isOpen);
        if (isOpen) {
            fetchOrganizations();
            setVisibleOrganizations(filterOrganizations(organizations));
        }
    }

    useEffect(() => {
        fetchOrganizations()
    }, [userId])

    useEffect(() => {
        if (selectedOrganization) {
            setFsRoom(selectedOrganization.id);
            // Jedino mesto upisa uloge: uloga korisnika u izabranoj organizaciji.
            useAccessStore.getState().setRole(
                (selectedOrganization.members.get(user.id) as OrganizationRole) ?? null
            );
        } else {
            setFsRoom(user.id);
            // Lični prostor (van organizacije): vlasnik ima pun pristup.
            useAccessStore.getState().setRole("admin");
        }

        console.log("ROOM_NAME ::>>", fsRoom);
    }, [selectedOrganization])

    useEffect(() => {
        if (isSearchOpen) setVisibleOrganizations(filterOrganizations(organizations));
    }, [queryString, isSearchOpen]);


    return {
        organizationExplorerCollapsed: isOpen,
        organizations: visibleOrganizations,
        query: queryString,
        selected: selectedOrganization,
        isSearchOpen,
        isLoading,
        fsRoom,
        toggleSearch,
        queryOrganizations: (query: string) => setQueryString(query),
        selectOrganization,
        refresh: fetchOrganizations,
        toggleOrganizationExplorer
    }
}