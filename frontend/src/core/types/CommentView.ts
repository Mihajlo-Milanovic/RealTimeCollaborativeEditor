import {UserView} from "@/core/types/UserView";
import {ReactionView} from "@/core/types/ReactionView";


export type CommentView = {
    id: string;
    content: string;
    commenter: UserView;
    createdAt?: string;
    edited?: boolean;
    reactions?: ReactionView[];
};