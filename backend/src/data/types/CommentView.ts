import {PlainResource} from "./PlainResource";
import {IComment} from "../interfaces/IComment";
import {toUserView, UserView} from "./UserView";
import {ReactionView, toReactionVew} from "./ReactionView";
import {IUser} from "../interfaces/IUser";
import {Types} from "mongoose";
import {IReaction} from "../interfaces/IReaction";
import {UserPrivileges} from "./UserPrivileges";

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
            // filtriramo null (orphan reference na obrisane reakcije) pre mapiranja
            r = comment.reactions
                .filter((x: any) => x != null)
                .map(reaction => toReactionVew(reaction as unknown as IReaction));
        else
            r = comment.reactions
    }

    let o: UserView = {id: "", username: "", email: "", verified: false, organizations: new Map<string, UserPrivileges>()};
    if (comment.commenter != null) {
        if (!((comment.commenter as any) instanceof Types.ObjectId))
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