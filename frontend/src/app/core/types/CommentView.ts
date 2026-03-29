import {UserView} from "@/app/core/types/UserView";
import {ReactionView} from "@/app/core/types/ReactionView";


export type CommentView = {
    id: string;
    content: string;
    commenter: UserView;
    createdAt?: string;
    edited?: boolean;
    reactions?: ReactionView[];
};