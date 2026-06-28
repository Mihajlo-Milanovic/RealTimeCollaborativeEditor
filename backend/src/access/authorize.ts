import {Types} from "mongoose";
import Organization from "../data/dao/OrganizationSchema";
import Directory from "../data/dao/DirectorySchema";
import File from "../data/dao/FileSchema";
import Comment from "../data/dao/CommentSchema";
import {UserPrivileges} from "../data/types/UserPrivileges";
import {DocumentAction, isAllowed} from "./accessPolicy";

/**
 * Razrešava ulogu korisnika za dati fajl tako što iz samog RESURSA (fajl ->
 * roditeljski direktorijumi -> organizacija) pronađe organizaciju i njenu
 * mapu članova. Time backend ne veruje frontendu (klijent ne šalje svoju ulogu).
 *
 * - Ako je fajl u organizaciji -> uloga iz org.members.
 * - Ako fajl nije ni u jednoj organizaciji (lični prostor) -> vlasnik = admin.
 */
export async function getUserRoleForFile(
    fileId: string,
    userId: string
): Promise<UserPrivileges | null> {

    const file = await File.findById(fileId).select("parent owner").exec();
    if (!file) return null;

    let currentDirId: Types.ObjectId | null = file.parent;
    const visited = new Set<string>();

    for (let depth = 0; currentDirId && depth < 50; depth++) {
        const key = currentDirId.toString();
        if (visited.has(key)) break;
        visited.add(key);

        // Organizacija drži svoje top-level direktorijume u children/projections.
        const org = await Organization.findOne({
            $or: [{children: currentDirId}, {projections: currentDirId}],
        }).select("members").exec();

        if (org) {
            return (org.members.get(userId) as UserPrivileges) ?? null;
        }

        const dir = await Directory.findById(currentDirId).select("parents").exec();
        if (!dir || !dir.parents || dir.parents.length === 0) break;
        currentDirId = dir.parents[0];
    }

    // Van organizacije: vlasnik ličnog fajla ima pun pristup, ostali nemaju.
    return file.owner?.toString() === userId ? "admin" : null;
}

export async function getUserRoleForComment(
    commentId: string,
    userId: string
): Promise<UserPrivileges | null> {
    const comment = await Comment.findById(commentId).select("file").exec();
    if (!comment) return null;
    return getUserRoleForFile(comment.file.toString(), userId);
}

/**
 * Centralna provera (backend autoritet). Vraća true ako je akcija dozvoljena.
 */
export function canPerform(
    role: UserPrivileges | null,
    action: DocumentAction
): boolean {
    return isAllowed(role, action);
}
