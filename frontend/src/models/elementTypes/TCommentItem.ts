import {CommentView} from "@/models/types/views/CommentView";
import {UserView} from "@/models/types/views/UserView";


export type TCommentItem = {
    comment: CommentView;
    user: UserView;              // autor komentara (za prikaz imena/avatara)
    currentUserId: string;       // ulogovani korisnik (za reakcije i vlasništvo)
    onUpdate: (id: string, content: string) => void;
    onDelete: (id: string) => void;
    // Propagira promenu reakcije kroz shared Yjs doc (re-fetch + setComments).
    onReactionChange: () => void | Promise<void>;
}