import {UserView} from "@/models/types/views/UserView";
import {ReactionView} from "@/models/types/views/ReactionView";


export type CommentView = {
    id: string;
    content: string;
    commenter: UserView;
    createdAt: string;
    edited: boolean;
    reactions: ReactionView[];
};