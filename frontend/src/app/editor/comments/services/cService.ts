import {deleteRequest, getRequestSingle, postRequest, putRequest} from "../../../api/serverRequests/methods";
import {CommentView} from "../../../../models/types/views/CommentView";

export const cService = {

    async getComments(fileId: string): Promise<CommentView[]> {
        const res = await getRequestSingle(`files/${fileId}/comments`);
        if (!res.ok) return [];

        const payload = await res.json();
        const data = payload?.data ?? payload;

        return Array.isArray(data) ? data : [];
    },

    async createComment(content: string, fileId: string, userId: string): Promise<boolean> {
        const res = await postRequest("comments", {
            content,
            file: fileId,
            commenter: userId,
        });

        return res.ok;
    },

    async updateComment(commentId: string, content: string): Promise<boolean> {
        const res = await putRequest(`comments/${commentId}/update`, {content});
        return res.ok;
    },

    async deleteComment(commentId: string): Promise<boolean> {
        const res = await deleteRequest(`comments/${commentId}`);
        return res.ok;
    },

    async addOrUpdateReaction(commentId: string, emoji: string, userId: string): Promise<boolean> {
        const res = await putRequest(`reactions/createOrUpdate`, {
            comment: commentId,
            reactionType: emoji,
            reactor: userId,
        });

        return res.ok;
    },

    async removeReaction(commentId: string, userId: string): Promise<boolean> {
        const res = await getRequestSingle(`reactions/comment/${commentId}/user/${userId}`);
        if (!res.ok) return false;

        const payload = await res.json();
        const data = payload?.data ?? payload;

        const deleteRes = await deleteRequest(`reactions/${data.id}`);
        return deleteRes.ok;
    }
};