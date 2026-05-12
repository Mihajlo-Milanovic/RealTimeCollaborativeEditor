import {useEffect, useState} from "react";
import {CommentView} from "../../../../models/types/views/CommentView";
import {cService} from "../services/cService";

export function useComments(fileId: string, userId: string) {

    const [comments, setComments] = useState<CommentView[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newText, setNewText] = useState("");

    const fetchComments = async () => {
        if (!fileId) return;

        setIsLoading(true);
        const commentViews = await cService.getComments(fileId);
        setComments(commentViews);
        setIsLoading(false);
    };

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

    useEffect(() => {
        fetchComments();
    }, [fileId]);


    return {
        comments,
        isLoading,
        newText,
        setNewText,
        addComment,
        updateComment,
        deleteComment,
        refresh: fetchComments
    };
}