import {PlainResource} from "./PlainResource";
import {IComment} from "../interfaces/IComment";
import {toUserView, UserView} from "./UserView";
import {ReactionView, toReactionVew} from "./ReactionView";
import {IUser} from "../interfaces/IUser";
import {Types} from "mongoose";
import {IReaction} from "../interfaces/IReaction";

export type CommentView = PlainResource<IComment, "file" | "commenter" | "reactions">
    & { commenter: UserView, reactions: Array<ReactionView> };

/**
 * Sets reactions to an empty array.
 * Expects populated commenter property.
 **/
export function toCommentView(comment: IComment): CommentView {

    let r: any = [];
    if (comment.reactions.length > 0) {
        if (!(comment.reactions[0] instanceof Types.ObjectId))
            r = comment.reactions.map(r => toReactionVew(r as unknown as IReaction));
        else
            r = comment.reactions
    }

    let o: UserView = {id: "", username: "", email: ""};
    if (comment.commenter != null) {
        if (!(comment.commenter instanceof Types.ObjectId))
            o = toUserView(comment.commenter as unknown as IUser);
        else
            o.id = comment.commenter._id.toHexString();
    }

    return {
        id: comment._id.toHexString(),
        commenter: o,
        content: comment.content,
        edited: comment.edited,
        reactions: r
    }
}