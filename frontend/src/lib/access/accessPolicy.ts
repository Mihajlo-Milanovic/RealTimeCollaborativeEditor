import {OrganizationRole} from "../../models/types/OrganizationRole";

/**
 * Sve operacije koje menjaju stanje dokumenta i moraju proći kroz Proxy.
 * Dodavanje nove akcije = dodavanje jednog člana u uniju + u policy ispod.
 */
export type DocumentAction =
    | "document:edit"
    | "comment:add"
    | "comment:edit"
    | "comment:delete"
    | "reaction:add"
    | "reaction:remove";

/**
 * JEDINI izvor istine za pravila pristupa (role -> dozvoljene akcije).
 * - "all": uloga sme sve (uključujući buduće akcije).
 * - Set akcija: uloga sme tačno te akcije.
 * Lako proširivo: nova uloga = novi ključ; nova privilegija = novi član Set-a.
 */
const POLICY: Record<OrganizationRole, "all" | ReadonlySet<DocumentAction>> = {
    admin: "all",
    editor: new Set<DocumentAction>([
        "document:edit",
        "comment:add",
        "comment:edit",
        "comment:delete",
        "reaction:add",
        "reaction:remove",
    ]),
    viewer: new Set<DocumentAction>(), // samo čitanje – nijedna mutacija
};

export function isAllowed(
    role: OrganizationRole | null | undefined,
    action: DocumentAction
): boolean {
    if (!role) return false;
    const rule = POLICY[role];
    if (!rule) return false;
    if (rule === "all") return true;
    return rule.has(action);
}
