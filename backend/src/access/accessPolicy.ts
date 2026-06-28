import {UserPrivileges} from "../data/types/UserPrivileges";

/**
 * Backend ogledalo iste politike pristupa kao na frontendu.
 * Backend je KONAČNI autoritet — frontend Proxy je samo UX.
 */
export type DocumentAction =
    | "document:edit"
    | "comment:add"
    | "comment:edit"
    | "comment:delete"
    | "reaction:add"
    | "reaction:remove";

const POLICY: Record<UserPrivileges, "all" | ReadonlySet<DocumentAction>> = {
    admin: "all",
    editor: new Set<DocumentAction>([
        "document:edit",
        "comment:add",
        "comment:edit",
        "comment:delete",
        "reaction:add",
        "reaction:remove",
    ]),
    viewer: new Set<DocumentAction>(),
};

export function isAllowed(
    role: UserPrivileges | null | undefined,
    action: DocumentAction
): boolean {
    if (!role) return false;
    const rule = POLICY[role];
    if (!rule) return false;
    if (rule === "all") return true;
    return rule.has(action);
}
