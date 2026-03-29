'use client';

import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {UserView} from "@/core/types/UserView";
import {OrganizationView} from "@/core/types/OrganizationView";
import {SimpleEditor} from "@/components/tiptap-templates/simple/simple-editor";
import {MembersModal} from "@/app/editor/fileSystem/ui/MembersModal";
import CommentsPanel from "@/comments/CommentsPanel";
import {getRequestSingle} from "@/app/api/serverRequests/methods";
import Sidebar from "@/app/editor/fileSystem/Sidebar";
import {X} from "lucide-react";
import OrganizationExplorer from "@/app/editor/fileSystem/ui/OrganizationExplorer";

export default function Editor(
    {
        selectedFileId
    }: {
        selectedFileId: string | null
    }
) {

    // if (!user) return null;

    return (
        <div>
            {selectedFileId != null ? (
                <SimpleEditor
                    key={selectedFileId}
                    fileId={selectedFileId}
                />
            ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500">
                    Choose a file for editing
                </div>
            )}
        </div>
    )

}
