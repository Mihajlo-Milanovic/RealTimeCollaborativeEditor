

export type OrganizationView = {
    id: string;
    name: string;
    organizer: string;
    members: Map<string, string>;
    children?: Array<{ id: string; name: string }>;
}