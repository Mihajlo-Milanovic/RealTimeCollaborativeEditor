import {PlainResource} from "./PlainResource";
import {IComment} from "../interfaces/IComment";
import {toUserView, UserView} from "./UserView";
import {ReactionView} from "./ReactionView";
import {IUser} from "../interfaces/IUser";
import {Types} from "mongoose";

export type CommentView = PlainResource<IComment, "file" | "commenter" | "reactions">
    & { commenter: UserView, reactions: Array<ReactionView> };

/**
 * Sets reactions to an empty array.
 * Expects populated commenter property.
 **/
export function toCommentView(comment: IComment): CommentView {

    let o: UserView = {id: "", username: "", email: ""};
    if (comment.commenter != null)
        if (!(comment.commenter instanceof Types.ObjectId))
            o = toUserView(comment.commenter as unknown as IUser);
        else
            o.id = comment.commenter._id.toHexString();

    return {
        id: comment._id.toHexString(),
        commenter: o,
        content: comment.content,
        edited: comment.edited,
        reactions: []
    }
}