import {emojisMap, ReactionType} from "../../../../models/types/ReactionType";
import {useEffect, useState} from "react";
import {TCommentItem} from "../../../../models/elementTypes/TCommentItem";
import {useReactions} from "../state/useReactions";
import {useCanAccess} from "../../../../lib/access/useCanAccess";


export function CommentItem(
    {
        comment,
        user,
        currentUserId,
        onUpdate,
        onDelete,
        onReactionChange,
    }: TCommentItem
) {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(comment.content);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(
        () => setText(comment.content),
        [comment.content]
    );

    const {
        groupedReactions,
        myReactionType,
        toggleReaction,
    } = useReactions(comment, currentUserId, onReactionChange);

    // Dozvole (UX) — odluku ionako donosi Proxy + backend.
    const canReact = useCanAccess("reaction:add");
    const canEditComment = useCanAccess("comment:edit");
    const canDeleteComment = useCanAccess("comment:delete");

    return (
        <div
            className="group rounded-2xl border border-slate-800 bg-slate-800/40 p-4 hover:bg-slate-800/60 transition-all">
            <div className="text-sm text-slate-400 mb-2.5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div
                        className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold border border-blue-500/20">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-300">@{user.username}</span>
                    {comment.edited && <span
                        className="text-[10px] opacity-50 px-1.5 py-0.5 rounded-full bg-slate-700">(edited)</span>}
                </div>

                {(currentUserId == comment.commenter.id && (canEditComment || canDeleteComment)) && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {canEditComment && (
                        <button
                            className="p-1.5 hover:bg-slate-700 rounded-lg text-yellow-500/70 hover:text-yellow-400 transition-colors"
                            onClick={() => setEditing((p) => !p)}
                            title="Edit"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                            </svg>
                        </button>
                        )}
                        {canDeleteComment && (
                        <button
                            className="p-1.5 hover:bg-slate-700 rounded-lg text-red-500/70 hover:text-red-400 transition-colors"
                            onClick={() => onDelete(comment.id)}
                            title="Delete"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                        )}
                    </div>
                )}
            </div>

            {editing ? (
                <div className="flex flex-col gap-2">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all min-h-20 resize-none"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-medium transition-colors"
                            onClick={() => setEditing(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-xs font-medium transition-colors"
                            onClick={() => {
                                onUpdate(comment.id, text);
                                setEditing(false);
                            }}
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-slate-200 leading-relaxed text-sm">{comment.content}</div>
            )}

            {/* Reactions Section */}
            <div className="mt-4 flex flex-wrap gap-2 items-center relative">
                {/* Po jedan pill za svaki distinct emoji (grupisano po tipu) */}
                {groupedReactions.map(({type, count, mine}) => (
                    <button
                        key={type}
                        onClick={() => canReact && toggleReaction(type)}
                        disabled={!canReact}
                        title={!canReact ? "Nemate dozvolu za reakcije" : (mine ? "Ukloni reakciju" : "Reaguj")}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs transition-colors ${
                            mine
                                ? "bg-blue-600/30 border-blue-500 text-white"
                                : "bg-slate-900/50 border-slate-700 hover:border-slate-500"
                        } ${!canReact ? "cursor-default opacity-80" : ""}`}
                    >
                        <span className="text-lg leading-none">
                            {emojisMap.get(type) || emojisMap.get('thumbs_up')}
                        </span>
                        <span className="text-slate-400 font-bold">{count}</span>
                    </button>
                ))}

                {/* Add Reaction Button — sakriven kada korisnik ne sme da reaguje */}
                {canReact && (
                <div className="relative">
                    <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-1.5 rounded-full hover:bg-slate-700 text-slate-400 transition-colors"
                        title="Dodaj reakciju"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </button>

                    {showEmojiPicker && (
                        <div
                            className="absolute bottom-full mb-2 left-0 z-50 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-2 flex gap-1 animate-in fade-in slide-in-from-bottom-2">
                            {[...emojisMap.keys()].map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={() => {
                                        setShowEmojiPicker(false);
                                        toggleReaction(emoji as ReactionType);
                                    }}
                                    className={`text-xl p-2 ${myReactionType == emoji ? "bg-blue-900 border-2 " : " "}hover:bg-slate-700 rounded-xl transition-all hover:scale-125`}
                                >
                                    {emojisMap.get(emoji)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                )}
            </div>
        </div>
    )
        ;
}