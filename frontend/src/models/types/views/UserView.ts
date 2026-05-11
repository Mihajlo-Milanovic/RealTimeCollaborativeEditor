

export type UserView = {
    id: string;
    username: string;
    email: string;
    verified: boolean;
    organizations: Map<string, string>;
}