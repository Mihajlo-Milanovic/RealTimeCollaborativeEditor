import {fsService} from "@/filesystem/services/fsService";
import {FileNode} from "@/core/types/FileNode";
import {OrganizationView} from "@/core/types/OrganizationView";

export const prompts = {

    async deleteFileNode(node: FileNode, refresh: () => void) {
        if (confirm(`Are you sure you want to delete ${node.isDirectory ? 'directory' : 'file'} "${node.name}"?`)) {
            const success = await fsService.deleteNode(node.id, node.isDirectory);
            if (success) refresh()
        }
    },

    async addFolderToFileNode(parentNode: FileNode, userId: string, refresh: () => void, parentIsOrganization: boolean = false) {
        const folderName = (prompt("Enter folder name:") || "")?.trim();
        if (!folderName) return;
        const success = await fsService.createFolderInFolder(folderName, parentNode.id, userId, parentIsOrganization);
        if (success) refresh()
    },

    async addFileToFileNode(parentNode: FileNode, userId: string, refresh: () => void) {
        const fileName = (prompt("Enter file name:") || "")?.trim();
        if (!fileName) return;
        const success = await fsService.createFile(fileName, parentNode.id, userId);
        if (success) refresh()
    },

    async deleteOrganization(organization: OrganizationView, userId: string, refresh: () => void) {
        if(!organization) return;
        const confirmDelete = confirm(`Are you sure you want to delete ${organization.name}?`)
        if (!confirmDelete) return
        const success = await fsService.deleteOrganization(organization.id, userId);
        if (success) refresh()

    }
}