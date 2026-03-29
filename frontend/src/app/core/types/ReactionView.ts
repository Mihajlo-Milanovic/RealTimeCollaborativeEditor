import {ReactionType} from "@/app/core/types/ReactionType";
import {UserView} from "@/app/core/types/UserView";


export type ReactionView = {
    id: string;
    reactionType: ReactionType;
    reactor: UserView,
};