import {OrganizationView} from "@/models/types/views/OrganizationView";
import {UserView} from "@/models/types/views/UserView";
import {FileNode} from "@/models/interfaces/FileNode";


export type TFileItem = {
    userId: string;
    organization: OrganizationView | null;
    node: FileNode;
    // onSelectFile: (id: string) => void;
    // selectedFileId: string | null;
    onRefreshAction: () => void;
}