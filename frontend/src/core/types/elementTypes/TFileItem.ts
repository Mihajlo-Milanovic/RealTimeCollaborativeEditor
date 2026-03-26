import {OrganizationView} from "@/core/types/OrganizationView";
import {UserView} from "@/core/types/UserView";
import {FileNode} from "@/core/types/FileNode";


export type TFileItem = {
    user: UserView;
    organization: OrganizationView | null;
    node: FileNode;
    onSelectFile?: (id: string) => void;
    onRefreshAction: () => void;
}