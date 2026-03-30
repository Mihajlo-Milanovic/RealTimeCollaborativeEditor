"use client";

import {useSession} from "next-auth/react";
import {CommentItem} from "@/app/editor/comments/components/CommentItem";
import {useComments} from "@/app/editor/comments/hooks/useComments";

export default function CommentsPanel({fileId}: { fileId: string }) {

    const {data} = useSession();
    const myUserId = (data?.user as unknown as {id: string})?.id || "";

    const {
        comments,
        loading,
        newText,
        setNewText,
        addComment,
        updateComment,
        deleteComment,
        react
    } = useComments(fileId, myUserId);

    return (
        <div className="w-full h-full flex flex-col p-4 bg-slate-900/50 text-white overflow-hidden">

            <div className="flex gap-2 mb-6">
                <input
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Napiši komentar..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button
                    onClick={addComment}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500"
                >
                    Dodaj
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
                {loading ? (
                    <div className="text-center text-slate-400">Učitavam...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center text-slate-500 italic">
                        Nema komentara
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {comments.map((c) => (
                            <CommentItem
                                key={c.id}
                                myUserId={myUserId}
                                comment={c}
                                user={c.commenter}
                                onUpdate={updateComment}
                                onDelete={deleteComment}
                                onReact={(emoji, already) =>
                                    react(c.id, emoji, already)
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}