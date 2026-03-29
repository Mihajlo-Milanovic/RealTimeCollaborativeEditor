import {useEffect, useState} from "react";
import {OrganizationView} from "@/core/types/OrganizationView";
import {fsService} from "@/app/editor/fileSystem/services/fsService";


export function useOrganizationExplorer(userId: string) {

    const [isOpen, setIsOpen] = useState(false);
    const [organizations, setOrganizations] = useState<OrganizationView[]>([]);
    const [visibleOrganizations, setVisibleOrganizations] = useState<OrganizationView[]>([]);
    const [selectedOrganization, setSelectedOrganization] = useState<OrganizationView | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [queryString, setQueryString] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const fetchOrganizations = async () => {
        if (!userId) return;

        setIsLoading(true);

        const memberships = await fsService.getOrganizationsForUser(userId);

        if (!memberships.size) {
            setOrganizations([]);
            setVisibleOrganizations([]);
            setIsLoading(false);
            return;
        }

        //Filter by name to reduce the number of organizations for fetching before calling API
        // const names = filterOrganizations(memberships.keys().toArray());
        const names = memberships.keys().toArray();

        const organizations = await fsService.getOrganizationsByNames(names);

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
        if (organization == null || selectedOrganization?.id == organization.id) setSelectedOrganization(null);
        else setSelectedOrganization(organization);
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
        if (isSearchOpen) setVisibleOrganizations(filterOrganizations(organizations));
    }, [queryString, isSearchOpen]);


    return {
        organizationExplorerCollapsed: isOpen,
        organizations: visibleOrganizations,
        query: queryString,
        selected: selectedOrganization,
        isSearchOpen,
        isLoading,
        toggleSearch,
        queryOrganizations: (query: string) => setQueryString(query),
        selectOrganization,
        refresh: fetchOrganizations,
        toggleOrganizationExplorer
    }
}