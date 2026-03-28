"use client";

import {useCallback, useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {getRequestSingle, postRequest, putRequest, deleteRequest} from "@/app/api/serverRequests/methods";
import {CommentItem} from "@/comments/CommentItem";
import {CommentView} from "@/core/types/CommentView";

export default function CommentsPanel({fileId}: { fileId: string }) {

    const {data} = useSession();
    const myUserId = (data?.user as unknown as {id: string})?.id || "";

    const [comments, setComments] = useState<CommentView[]>([]);
    const [newText, setNewText] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const res = await getRequestSingle(`files/${fileId}/comments`);
            if (!res.ok) return;

            const payload = await res.json();
            const data = payload?.data ?? payload;
            setComments(Array.isArray(data) ? data : []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [fileId]);

    const addComment = async () => {
        if (!newText.trim() || !myUserId) return;

        const res = await postRequest("comments/create", {
            content: newText.trim(),
            file: fileId,
            commenter: myUserId,
        });

        const errPayload = await res.json().catch(() => null);
        console.log("create comment status:", res.status);
        console.log("create comment response:", errPayload);
        if (!res.ok) return;

        if (res.ok) {
            setNewText("");
            await fetchComments();
        }
    };

    const updateComment = async (commentId: string, content: string) => {
        const res = await putRequest(`comments/${commentId}/update`, {content});
        if (res.ok) await fetchComments();
    };

    const removeComment = async (commentId: string) => {
        const res = await deleteRequest(`comments/${commentId}/delete`);
        if (res.ok) await fetchComments();
    };

    const addReaction = async (commentId: string, emoji: string, alreadyReacted: boolean) => {

        if (myUserId.length == 0) return;

        const comment = comments.find(c => c.id == commentId);
        if (!comment) return;

        let res: Response;

        try {
            if (alreadyReacted) {
                res = await getRequestSingle(`reactions/comment/${commentId}/user/${myUserId}`);

                console.log(res);
                if (!res.ok) return;
                const payload = await res.json();
                console.log(payload);
                const data = payload?.data ?? payload;
                console.log(data);

                res = await deleteRequest(`reactions/${data.id}/delete`)
            } else {
                res = await putRequest(`reactions/createOrUpdate`, {
                    comment: commentId,
                    reactionType: emoji,
                    reactor: myUserId,
                });
            }
            if (res.ok) await fetchComments();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="w-full h-full flex flex-col p-4 bg-slate-900/50 text-white overflow-hidden">
            <div className="flex gap-2 mb-6">
                <input
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Napiši komentar..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
                />
                <button
                    onClick={addComment}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-medium transition-colors shadow-lg shadow-blue-900/20 active:scale-95"
                >
                    Dodaj
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-32 gap-3">
                        <div
                            className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-sm text-slate-400">Učitavam komentare...</div>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-slate-500 italic">Još uvek nema komentara.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {comments.map((c) => {
                            return (
                                <CommentItem
                                    key={c.id}
                                    myUserId={myUserId}
                                    comment={c}
                                    user={c.commenter}
                                    onUpdate={updateComment}
                                    onDelete={removeComment}
                                    onReact={(emoji, alreadyReacted) => addReaction(c.id, emoji, alreadyReacted)}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

