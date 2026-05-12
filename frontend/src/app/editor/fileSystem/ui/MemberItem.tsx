import {OrganizationRole} from "../../../../models/types/OrganizationRole";
import {TMemberItem} from "../../../../models/elementTypes/TMemberItem";

const roleClasses: Record<OrganizationRole, string> = {
    admin: "text-red-300 bg-red-500/10 border-red-500/30",
    editor: "text-blue-300 bg-blue-500/10 border-blue-500/30",
    viewer: "text-slate-300 bg-slate-500/10 border-slate-500/30",
};

export function MemberItem(
    {
        member,
        onChangeRole,
        onRemove,
        showChangeRoleAndRemove
    }: TMemberItem
) {

    return (
        <div
            className="flex items-center justify-between gap-3 rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2">
            <div className="min-w-0">
                <div className="truncate text-sm text-slate-200">{member.username}</div>
                <div className="text-[11px] text-slate-500">{member.email}</div>
            </div>
            <div className="flex items-center gap-2">
                <span
                    className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${roleClasses[member.role]}`}>
                    {member.role}
                </span>

                {showChangeRoleAndRemove && (
                    <div
                        className="flex items-center justify-between gap-3">
                        <button
                            onClick={() => onChangeRole(member)}
                            className="rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                        >
                            Change role
                        </button>

                        <button
                            onClick={() => onRemove(member)}
                            className="rounded-md border border-red-900/60 px-2 py-1 text-xs text-red-300 hover:bg-red-950/60 transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
        ;
};
