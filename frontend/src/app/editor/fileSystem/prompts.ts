import {FileNode} from "../../../models/interfaces/FileNode";
import {OrganizationView} from "../../../models/types/views/OrganizationView";
import {NodeType} from "../../../models/types/NodeType";
import {apiClient} from "../../../lib/apiClient";

export const prompts = {

    async deleteFileNode(node: FileNode, userId: string, refresh: () => void) {
        if (confirm(`Are you sure you want to delete ${node.type == NodeType.DIR ? 'directory' : 'file'} "${node.name}"?`)) {
            const success = await apiClient.explorer.deleteNode(node.id, node.type, userId);
            if (success) refresh();
            else alert(`Could not delete ${node.type == NodeType.DIR ? 'directory' : 'file'} "${node.name}".`);
        }
    },

    async addFolderToFileNode(parentNode: FileNode | null, userId: string, refresh: () => void) {
        if (!parentNode) return;
        const folderName = (prompt("Enter folder name:") || "")?.trim();
        if (!folderName) return;
        const success = await apiClient.explorer.createNode(userId, folderName, NodeType.DIR, parentNode.id, parentNode.type);
        if (success) refresh();
        else alert("Could not create folder.");
    },

    async addFileToFileNode(parentNode: FileNode, userId: string, refresh: () => void) {
        const fileName = (prompt("Enter file name:") || "")?.trim();
        if (!fileName) return;
        const success = await apiClient.explorer.createNode(userId, fileName, NodeType.FILE, parentNode.id, NodeType.DIR);
        if (success) refresh();
        else alert("Could not create file.");
    },

    async deleteOrganization(organization: OrganizationView, userId: string, refresh: () => void) {
        if(!organization) return;
        const confirmDelete = confirm(`Are you sure you want to delete organization ${organization.name}?`)
        if (!confirmDelete) return
        const success = await apiClient.explorer.deleteNode(organization.id, NodeType.ORG, userId);
        if (success) refresh();
        else alert("Could not delete organization.");

    },

    async leaveOrganization(organization: OrganizationView, userId: string, refresh: () => void) {
        if (!organization || !userId) return;

        const role = organization.members.get(userId);

        // Admin koji napušta organizaciju => organizacija se briše
        // (reuse postojeće delete logike umesto dupliranja koda).
        if (role === "admin") {
            await this.deleteOrganization(organization, userId, refresh);
            return;
        }

        // Običan član => uklanja samo sebe iz organizacije.
        if (!confirm(`Leave organization "${organization.name}"?`)) return;
        const success = await apiClient.explorer.removeMember(organization.id, userId, userId);
        if (success) refresh();
        else alert("Could not leave organization.");
    },

    async createOrganization(userId: string, refresh: () => void) {
        if (!userId) return;
        const name = prompt("Enter organization name:")?.trim() || "";
        if (!name) return;
        const success = await apiClient.explorer.createNode(userId, name, NodeType.ORG);
        if (success) refresh();
        else alert("Could not create organization.");
    },

    async editOrganization(userId: string) {
        //TODO: editOrganization logic
        alert("NO IMPLEMENTATION");
    }
}