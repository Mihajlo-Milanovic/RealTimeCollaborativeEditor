import {ReactionType} from "@/models/types/ReactionType";
import {UserView} from "@/models/types/views/UserView";


export type ReactionView = {
    id: string;
    reactionType: ReactionType;
    reactor: UserView,
};