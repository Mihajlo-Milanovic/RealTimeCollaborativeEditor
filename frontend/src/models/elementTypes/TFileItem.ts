import {OrganizationView} from "../types/views/OrganizationView";
import {FileNode} from "../interfaces/FileNode";


export type TFileItem = {
    organization: OrganizationView | null;
    node: FileNode;
    refreshParentAction: () => void;
}