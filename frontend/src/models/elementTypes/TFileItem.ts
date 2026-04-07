import {OrganizationView} from "@/app/core/types/OrganizationView";
import {UserView} from "@/app/core/types/UserView";
import {FileNode} from "@/app/core/types/FileNode";


export type TFileItem = {
    user: UserView;
    organization: OrganizationView | null;
    node: FileNode;
    onSelectFile?: (id: string) => void;
    onRefreshAction: () => void;
}