import {ReactionType} from "../ReactionType";
import {UserView} from "./UserView";


export type ReactionView = {
    id: string;
    reactionType: ReactionType;
    reactor: UserView,
};