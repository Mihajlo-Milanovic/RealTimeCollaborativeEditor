import {CommentView} from "@/models/types/views/CommentView";
import {UserView} from "@/models/types/views/UserView";


export type TCommentItem = {
    comment: CommentView;
    user: UserView;
    onUpdate: (id: string, content: string) => void;
    onDelete: (id: string) => void;
    // onReact: (emoji: string, alreadyReacted: boolean) => void;
}