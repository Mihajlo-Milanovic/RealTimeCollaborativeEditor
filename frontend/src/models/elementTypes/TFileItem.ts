import {OrganizationView} from "../types/views/OrganizationView";
// import {UserView} from "../types/views/UserView";
import {FileNode} from "../interfaces/FileNode";


export type TFileItem = {
    // userId: string;
    organization: OrganizationView | null;
    node: FileNode;
    // onSelectFile: (id: string) => void;
    // selectedFileId: string | null;
    onRefreshAction: () => void;
}