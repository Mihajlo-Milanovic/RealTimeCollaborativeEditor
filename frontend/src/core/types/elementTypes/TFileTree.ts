import {UserView} from "@/core/types/UserView";
import {OrganizationView} from "@/core/types/OrganizationView";


export type TFileTree = {
    user: UserView;
    organization: OrganizationView | null;
    onSelectFile?: (id: string) => void;
    refreshKey?: number;
    // onCloseTreeAction: () => void;
    // onAddFolderAction: () => void;
    // onAddFileAction: () => void;
}