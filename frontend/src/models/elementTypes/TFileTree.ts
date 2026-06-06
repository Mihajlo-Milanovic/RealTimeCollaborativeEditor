import {OrganizationView} from "../types/views/OrganizationView";


export type TFileTree = {
    // userId: string;
    organization: OrganizationView | null;
    // onSelectFile: (id: string) => void;
    // selectedFileId: string | null;
    refreshKey?: number;
    onCloseCurrentOrganizationFSAction: () => void;
    // onCloseTreeAction: () => void;
    // onAddFolderAction: () => void;
    // onAddFileAction: () => void;
}