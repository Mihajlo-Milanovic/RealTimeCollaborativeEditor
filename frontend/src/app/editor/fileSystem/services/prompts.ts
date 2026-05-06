import {fsService} from "@/app/editor/fileSystem/services/fsService";
import {FileNode} from "@/models/interfaces/FileNode";
import {OrganizationView} from "@/models/types/views/OrganizationView";
import {NodeType} from "@/models/types/NodeType";
import {apiClient} from "@/lib/apiClient";

export const prompts = {

    async deleteFileNode(node: FileNode, refresh: () => void) {
        if (confirm(`Are you sure you want to delete ${node.type == NodeType.DIR ? 'directory' : 'file'} "${node.name}"?`)) {
            const success = await apiClient.deleteNode(node.id, node.type);
            if (success) refresh();
            else alert(`Could not delete ${node.type == NodeType.DIR ? 'directory' : 'file'} "${node.name}".`);
        }
    },

    async addFolderToFileNode(parentNode: FileNode, userId: string, refresh: () => void, parentIsOrganization: boolean = false) {
        const folderName = (prompt("Enter folder name:") || "")?.trim();
        if (!folderName) return;
        const success = await fsService.createFolderInFolder(folderName, parentNode.id, userId, parentIsOrganization);
        if (success) refresh();
        else alert("Could not create folder.");
    },

    async addFileToFileNode(parentNode: FileNode, userId: string, refresh: () => void) {
        const fileName = (prompt("Enter file name:") || "")?.trim();
        if (!fileName) return;
        const success = await fsService.createFile(fileName, parentNode.id, userId);
        if (success) refresh();
        else alert("Could not create file.");
    },

    async deleteOrganization(organization: OrganizationView, userId: string, refresh: () => void) {
        if(!organization) return;
        const confirmDelete = confirm(`Are you sure you want to delete organization ${organization.name}?`)
        if (!confirmDelete) return
        const success = await fsService.deleteOrganization(organization.id, userId);
        if (success) refresh();
        else alert("Could not delete organization.");

    },

    async createOrganization(userId: string, refresh: () => void) {
        if (!userId) return;
        const name = prompt("Enter organization name:")?.trim() || "";
        if (!name) return;
        const success = await fsService.createOrganization(name, userId);
        if (success) refresh();
        else alert("Could not create organization.");
    },

    async editOrganization(userId: string, refresh: () => void) {
        //TODO
        alert("NO IMPLEMENTATION");
    }
}