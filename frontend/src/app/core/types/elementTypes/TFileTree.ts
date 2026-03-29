import {UserView} from "@/app/core/types/UserView";
import {OrganizationView} from "@/app/core/types/OrganizationView";


export type TFileTree = {
    user: UserView;
    organization: OrganizationView | null;
    onSelectFile?: (id: string) => void;
    refreshKey?: number;
    onCloseCurrentOrganizationFSAction: () => void;
    // onCloseTreeAction: () => void;
    // onAddFolderAction: () => void;
    // onAddFileAction: () => void;
}