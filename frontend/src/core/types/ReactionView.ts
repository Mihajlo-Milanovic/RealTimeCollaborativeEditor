import {ReactionType} from "@/core/types/ReactionType";
import {UserView} from "@/core/types/UserView";


export type ReactionView = {
    id: string;
    reactionType: ReactionType;
    reactor: UserView,
};