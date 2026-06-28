"use client";

import {CommentItem} from "./CommentItem";
import {useComments} from "../state/useComments";
import {useCanAccess} from "../../../../lib/access/useCanAccess";
import {TCommentPanel} from "../../../../models/elementTypes/TCommentPanel";

export default function CommentsPanel(
    {
        userId,
        fileId
    }: TCommentPanel
) {

    const {
        comments,
        isLoading,
        newText,
        setNewText,
        addComment,
        updateComment,
        deleteComment,
        refresh,
    } = useComments(fileId, userId);

    // UI ograničenje (UX) — stvarnu odluku ionako donosi Proxy + backend.
    const canComment = useCanAccess("comment:add");

    return (
        <div className="w-full h-full flex flex-col p-4 bg-slate-900/50 text-white overflow-hidden">

            <div className="flex gap-2 mb-6">
                <input
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    disabled={!canComment}
                    placeholder={canComment ? "Napiši komentar..." : "Nemate dozvolu za komentarisanje"}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                    onClick={addComment}
                    disabled={!canComment}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
                {isLoading ? (
                    <div className="text-center text-slate-400">Loading...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center text-slate-500 italic">
                        No comments yet...
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {comments.map((c) => (
                            <CommentItem
                                key={c.id}
                                comment={c}
                                user={c.commenter}
                                currentUserId={userId}
                                onUpdate={updateComment}
                                onDelete={deleteComment}
                                onReactionChange={refresh}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}