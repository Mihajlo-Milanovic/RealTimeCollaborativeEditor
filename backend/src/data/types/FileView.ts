import {PlainResource} from "./PlainResource";
import {IFile} from "../interfaces/IFile";
import {toUserView, UserView} from "./UserView";
import {IUser} from "../interfaces/IUser";
import {Types} from "mongoose";
import {IDirectory} from "../interfaces/IDirectory";
import {CommentView, toCommentView} from "./CommentView";
import {IComment} from "../interfaces/IComment";
import {UserPrivileges} from "./UserPrivileges";


export type FileView = PlainResource<IFile, "parent" | "owner" | "comments">
    & { owner: UserView, comments: Array<CommentView> };

export function toFileView(file: IFile): FileView {

    let c: any = [];
    if (file.comments.length > 0) {
        if (!(file.comments[0] instanceof Types.ObjectId))
            c = file.comments.map(c => toCommentView(c as unknown as IComment));
        else
            c = file.comments;
    }

    let o: UserView = {id: "", username: "", email: "", organizations: new Map<string, UserPrivileges>()};
    if (file.owner != null) {
        if (!((file.owner as any) instanceof Types.ObjectId))
            o = toUserView(file.owner as unknown as IUser);
        else
            o.id = file.owner._id.toHexString();
    }

    return {
        id: file._id.toHexString(),
        name: file.name,
        owner: o,
        yDocState: file.yDocState,
        version: file.version,
        comments: c,
    }
}