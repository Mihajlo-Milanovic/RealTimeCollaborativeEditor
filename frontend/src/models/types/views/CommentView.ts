import {UserView} from "./UserView";
import {ReactionView} from "./ReactionView";


export type CommentView = {
    id: string;
    content: string;
    commenter: UserView;
    createdAt: string;
    edited: boolean;
    reactions: ReactionView[];
};