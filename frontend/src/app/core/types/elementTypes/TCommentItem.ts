import {CommentView} from "@/app/core/types/CommentView";
import {UserView} from "@/app/core/types/UserView";


export type TCommentItem = {
    comment: CommentView;
    user: UserView;
    onUpdate: (id: string, content: string) => void;
    onDelete: (id: string) => void;
    // onReact: (emoji: string, alreadyReacted: boolean) => void;
}