import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { MemberItem } from './MemberItem';
import {useOrganizationMembers} from "@/hooks/useOrganizationMembers";
import {OrganizationView} from "@/core/types/OrganizationView";
import {OrganizationMember} from "@/core/types/OrganizationMember";
import {OrganizationRole} from "@/core/types/OrganizationRole";

interface MembersModalProps {
    organization: OrganizationView;
    currentUserId: string;
    onClose: () => void;
    onRefreshOrganizations: () => void;
}

export const MembersModal: React.FC<MembersModalProps> = ({
    organization,
    currentUserId,
    onClose,
    onRefreshOrganizations
}) => {
    const {
        members,
        isLoading,
        changeRole,
        removeMember,
        addMemberByUsername
    } = useOrganizationMembers(organization, currentUserId);

    const [memberForRoleChange, setMemberForRoleChange] = useState<OrganizationMember | null>(null);
    const [selectedRole, setSelectedRole] = useState<OrganizationRole>("viewer");
    const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
    const [newMemberUsername, setNewMemberUsername] = useState("");
    const [newMemberRole, setNewMemberRole] = useState<OrganizationRole>("viewer");

    const handleChangeRole = async () => {
        if (!memberForRoleChange) return;
        const success = await changeRole(memberForRoleChange.id, selectedRole);
        if (success) {
            setMemberForRoleChange(null);
            onRefreshOrganizations();
        } else {
            alert("Could not update role.");
        }
    };

    const handleRemove = async (member: OrganizationMember) => {
        const success = await removeMember(member);
        if (success) {
            onRefreshOrganizations();
        } else if (!success) {
             // alert handled in hook or if user cancelled
        }
    };

    const handleAddMember = async () => {
        const username = newMemberUsername.trim();
        if (!username) {
            alert("Username is required.");
            return;
        }
        const success = await addMemberByUsername(username, newMemberRole);
        if (success) {
            setNewMemberUsername("");
            setNewMemberRole("viewer");
            setIsAddMemberDialogOpen(false);
            onRefreshOrganizations();
        } else {
            alert("Could not add member.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-2xl rounded-lg border border-slate-700 bg-slate-900 p-4 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-100">{organization.name}</h3>
                    </div>

                    <div className="flex gap-1">
                        <button
                            onClick={() => setIsAddMemberDialogOpen(true)}
                            className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                            title="Add member"
                        >
                            <UserPlus size={16} />
                        </button>

                        <button
                            onClick={onClose}
                            className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                            title="Close members window"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-xs text-slate-400">Loading members...</div>
                ) : members.length === 0 ? (
                    <div className="text-xs text-slate-400">No members found.</div>
                ) : (
                    <div className="max-h-[60vh] overflow-y-auto space-y-2">
                        {members.map((member) => (
                            <MemberItem
                                key={member.id}
                                member={member}
                                onChangeRole={(m) => {
                                    setMemberForRoleChange(m);
                                    setSelectedRole(m.role);
                                }}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Change Role Dialog */}
            {memberForRoleChange && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 p-4">
                        <h4 className="text-sm font-semibold text-slate-100 mb-1">Change Role</h4>
                        <p className="text-xs text-slate-400 mb-3">{memberForRoleChange.username}</p>
                        <div className="space-y-2">
                            {(["admin", "editor", "viewer"] as OrganizationRole[]).map((roleOption) => (
                                <label key={roleOption} className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="member-role"
                                        value={roleOption}
                                        checked={selectedRole === roleOption}
                                        onChange={() => setSelectedRole(roleOption)}
                                    />
                                    <span className="capitalize">{roleOption}</span>
                                </label>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setMemberForRoleChange(null)}
                                className="rounded-md border border-slate-600 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleChangeRole}
                                className="rounded-md border border-slate-500 bg-slate-800 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-700 transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Member Dialog */}
            {isAddMemberDialogOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 p-4">
                        <h4 className="text-sm font-semibold text-slate-100 mb-3">Add Member</h4>
                        <label className="mb-3 block">
                            <span className="mb-1 block text-xs text-slate-400">Username</span>
                            <input
                                type="text"
                                value={newMemberUsername}
                                onChange={(e) => setNewMemberUsername(e.target.value)}
                                placeholder="Enter username"
                                className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
                                autoFocus
                            />
                        </label>

                        <div className="space-y-2">
                            <div className="text-xs text-slate-400">Role</div>
                            {(["admin", "editor", "viewer"] as OrganizationRole[]).map((roleOption) => (
                                <label key={roleOption} className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="new-member-role"
                                        value={roleOption}
                                        checked={newMemberRole === roleOption}
                                        onChange={() => setNewMemberRole(roleOption)}
                                    />
                                    <span className="capitalize">{roleOption}</span>
                                </label>
                            ))}
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setIsAddMemberDialogOpen(false);
                                    setNewMemberUsername("");
                                    setNewMemberRole("viewer");
                                }}
                                className="rounded-md border border-slate-600 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddMember}
                                className="rounded-md border border-slate-500 bg-slate-800 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-700 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
