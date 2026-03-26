import {useEffect, useState} from "react";
import {OrganizationView} from "@/core/types/OrganizationView";
import {fsService} from "@/filesystem/services/fsService";


export function useOrganizationExplorer(userId: string) {

    const [organizations, setOrganizations] = useState<OrganizationView[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [visibleOrganizations, setVisibleOrganizations] = useState<OrganizationView[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [queryString, setQueryString] = useState("");


    const fetchOrganizations = async () => {
        if (!userId) return;

        setIsLoading(true);

        const memberships = await fsService.getOrganizationsForUser(userId);

        console.log("Fetched memberships:", memberships);

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

        console.log("Fetched organizations:", organizations);

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

    useEffect(() => {
        fetchOrganizations()
    }, [userId])

    useEffect(() => {
        if (isSearchOpen) setVisibleOrganizations(filterOrganizations(organizations));
    }, [queryString, isSearchOpen]);


    return {
        organizations: visibleOrganizations,
        query: queryString,
        isSearchOpen,
        isLoading,
        queryOrganizations: (query: string) => setQueryString(query),
        toggleSearch,
        refresh: fetchOrganizations}
}