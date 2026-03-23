import {OrganizationView} from "@/core/types/OrganizationView";
import {UserView} from "@/core/types/UserView";
import {FileNode} from "@/core/types/FileNode";
import React from "react";


export type TFileItem = {
    user: UserView;
    organization: OrganizationView | null;
    node: FileNode;
    onSelectFile?: (id: string) => void;
    onRefreshAction: (id: string, setChildren: React.Dispatch<React.SetStateAction<FileNode[]>>) => void;
}