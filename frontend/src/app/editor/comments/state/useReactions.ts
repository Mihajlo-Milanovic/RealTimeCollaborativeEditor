import {CommentView} from "@/models/types/views/CommentView";
import {cService} from "@/app/editor/comments/services/cService";
import {useEffect, useState} from "react";


export const useReactions = (comment: CommentView, userId: string) => {

    const [emojiToDisplay, setEmojiToDisplay] = useState<string>('');
    const [alreadyReacted, setAlreadyReacted] = useState<boolean>(false);
    const reactToComment = async (emoji: string) => {
        if (!userId) return;

        cService.addOrUpdateReaction(comment.id, emoji, userId);
        setAlreadyReacted(true);
        setEmojiToDisplay(emoji);
    };

    const removeReaction = async () => {
        cService.removeReaction(comment.id, userId);
        setAlreadyReacted(false);
        setEmojiToDisplay("");
    }

    function refresh() {
        if (alreadyReacted){
            return;
        }
        if (!(comment.reactions)) {
            setEmojiToDisplay('');
        }
        else comment.reactions.find(reaction => {
            if(reaction.reactor.id == userId) {
                setAlreadyReacted(true);
                setEmojiToDisplay(reaction.reactionType);
            }
            else {
                setAlreadyReacted(false);
                setEmojiToDisplay(comment.reactions[0].reactionType ?? "");
            }
        });
    }

    useEffect(() => {
        refresh();
    }, [comment, userId]);

    return {
        emojiToDisplay,
        alreadyReacted,
        refresh,
        reactToComment,
        removeReaction
    }
};