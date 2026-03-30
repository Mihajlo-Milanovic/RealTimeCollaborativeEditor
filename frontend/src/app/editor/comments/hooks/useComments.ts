import {useEffect, useState} from "react";
import {CommentView} from "@/app/core/types/CommentView";
import {cService} from "@/app/editor/comments/services/cService";

export function useComments(fileId: string, userId: string) {

    const [comments, setComments] = useState<CommentView[]>([]);
    const [loading, setLoading] = useState(false);
    const [newText, setNewText] = useState("");

    const fetchComments = async () => {
        if (!fileId) return;

        setLoading(true);
        const data = await cService.getComments(fileId);
        setComments(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchComments();
    }, [fileId]);

    const addComment = async () => {
        if (!newText.trim() || !userId) return;

        const success = await cService.createComment(newText.trim(), fileId, userId);
        if (success) {
            setNewText("");
            fetchComments();
        }
    };

    const updateComment = async (id: string, content: string) => {
        const success = await cService.updateComment(id, content);
        if (success) fetchComments();
    };

    const deleteComment = async (id: string) => {
        const success = await cService.deleteComment(id);
        if (success) fetchComments();
    };

    const react = async (commentId: string, emoji: string, alreadyReacted: boolean) => {
        if (!userId) return;

        let success = false;

        if (alreadyReacted) {
            success = await cService.removeReaction(commentId, userId);
        } else {
            success = await cService.addOrUpdateReaction(commentId, emoji, userId);
        }

        if (success) fetchComments();
    };

    return {
        comments,
        loading,
        newText,
        setNewText,
        addComment,
        updateComment,
        deleteComment,
        react,
        refresh: fetchComments
    };
}