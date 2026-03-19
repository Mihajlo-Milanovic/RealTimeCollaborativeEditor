import {getRequestSingle} from "@/app/api/serverRequests/methods";

export class UserView {
    // private static instance?: UserView | null = null;

    id: string;
    email: string;
    username: string;
    organizations: Map<string, string>;

    private constructor(
        id: string = "",
        email: string = "",
        username: string = "",
        organizations: Map<string, string> = new Map<string, string>()
    ) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.organizations = organizations;
    }

    static async getUserByEmail(email: string): Promise<UserView> {
        if (!email) return new UserView();

        const res = await getRequestSingle(`users/email/${encodeURIComponent(email)}`);
        if (!res.ok) return new UserView();

        const data = await res.json();
        return data?.data as UserView;
    }

    // static getInstance(email: string): UserView {
    //     if (UserView.instance == null || UserView.instance.email != email) {
    //         UserView.fillFromSession(email).then(r => this.instance = r)
    //     }
    //     return UserView.instance as UserView;
    // }
    // private static async fillFromSession(email: string) {
    //     if (email) {
    //         const userViewResponse = await getRequestSingle(
    //             `users/email/${encodeURIComponent(email)}`
    //         );
    //
    //         if (userViewResponse.ok) {
    //             const orgViewPayload = await userViewResponse.json()
    //             return (orgViewPayload?.data) as UserView;
    //         }
    //     }
    //     return new UserView();
    // }
    // static deleteInstance() {
    //   UserView.instance = null;
    // }
}
export default UserView;