import {UserView} from "@/models/types/views/UserView";
import {Session} from "next-auth";
import {apiClient} from "@/lib/apiClient";

export class User {
    private static instance: User;

    private _id: string = "";
    private _username: string = "";
    private _email: string = "";
    private _verified: boolean = false;
    private _organizations: Map<string, string> = new Map();

    private _isLoaded: boolean = false;
    private _loadPromise: Promise<void> | null = null;

    private constructor() {}

    static getInstance(): User {
        if (!User.instance) {
            User.instance = new User();
        }
        return User.instance;
    }

    // Fetch and populate user data from the API
    async load(session: Session): Promise<void> {
        // Return existing load promise if already in flight
        if (this._loadPromise) return this._loadPromise;
        // No-op if already loaded
        if (this._isLoaded) return;

        this._loadPromise = (async () => {
            const email = session?.user?.email;
            if (!email) throw new Error("No email found on session.");

            const user = await apiClient.user.getByEmail(email);
            if (!user) throw new Error(`Failed to fetch user`);

            this._id = user.id;
            this._username = user.username;
            this._email = user.email;
            this._verified = user.verified;
            this._organizations = new Map<string, string>(
                Object.entries(user.organizations ?? {})
            );
            this._isLoaded = true;
        })();

        try {
            await this._loadPromise;
        } finally {
            this._loadPromise = null;
        }
    }

    // Reset the store (e.g. on logout)
    reset(): void {
        this._id = "";
        this._username = "";
        this._email = "";
        this._verified = false;
        this._organizations = new Map();
        this._isLoaded = false;
        this._loadPromise = null;
    }

    // Getters
    get id(): string { return this._id; }
    get username(): string { return this._username; }
    get email(): string { return this._email; }
    get verified(): boolean { return this._verified; }
    get organizations(): Map<string, string> { return this._organizations; }
    get isLoaded(): boolean { return this._isLoaded; }

    // Snapshot of all fields at once
    get data(): UserView {
        return {
            id: this._id,
            username: this._username,
            email: this._email,
            verified: this._verified,
            organizations: this._organizations,
        };
    }
}

// Export the singleton instance directly
export const user = User.getInstance();