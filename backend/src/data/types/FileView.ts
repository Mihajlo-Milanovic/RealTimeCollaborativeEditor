import {PlainResource} from "./PlainResource";
import {IFile} from "../interfaces/IFile";
import {toUserView, UserView} from "./UserView";
import {IUser} from "../interfaces/IUser";
import {Types} from "mongoose";
import {IDirectory} from "../interfaces/IDirectory";
import {CommentView, toCommentView} from "./CommentView";
import {IComment} from "../interfaces/IComment";


export type FileView = PlainResource<IFile, "parent" | "owner" | "comments">
    & {owner: UserView, comments: Array<CommentView>};

export function toFileView(file: IFile): FileView {

    let c: Array<CommentView> = [];
    if (file.comments.length > 0 && !(file.comments[0] instanceof Types.ObjectId))
        c = file.comments.map(c => toCommentView(c as unknown as IComment));

    let o: UserView = { id: "", username: "", email: ""};
    if (file.owner != null && !(file.owner instanceof Types.ObjectId))
        o = toUserView(file.owner as unknown as IUser);

    return {
        id: file._id.toHexString(),
        name: file.name,
        owner: o,
        yDocState: file.yDocState,
        version: file.version,
        comments: c,
    }
}