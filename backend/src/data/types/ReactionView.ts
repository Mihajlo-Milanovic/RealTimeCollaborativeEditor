import {PlainResource} from "./PlainResource";
import {IReaction} from "../interfaces/IReaction";
import {toUserView, UserView} from "./UserView";
import {IUser} from "../interfaces/IUser";
import {Types} from "mongoose";


export type ReactionView = PlainResource<IReaction, "comment" | "reactor">
    & { reactor: UserView };

export function toReactionVew(reaction: IReaction): ReactionView{

    let r: UserView = { id: "", username: "", email: ""};
    if (reaction.reactor != null) {
        if (!(reaction.reactor instanceof Types.ObjectId))
            r = toUserView(reaction.reactor as unknown as IUser);
        else
            r.id = reaction.reactor._id.toHexString();
    }

    return {
        id: reaction._id.toHexString(),
        reactionType: reaction.reactionType,
        reactor: r
    }
}