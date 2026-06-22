import {PlainResource} from "./PlainResource";
import {IDirectory} from "../interfaces/IDirectory";
import {toUserView, UserView} from "./UserView";
import {IUser} from "../interfaces/IUser";
import {FileView, toFileView} from "./FileView";
import {IFile} from "../interfaces/IFile";
import {Types} from "mongoose";


export type DirectoryView = PlainResource<IDirectory, /*"parents" |*/ "owner" | "children" | "files">
    & { owner: UserView, children: Array<DirectoryView>, files: Array<FileView> , type: "dir"};

export function toDirectoryView(directory: IDirectory): DirectoryView {

    console.log(directory)

    let c: any = [];
    if (directory.children.length > 0) {
        if (!(directory.children[0] instanceof Types.ObjectId))
            c = directory.children.map(c => toDirectoryView(c as unknown as IDirectory));
        else
            c = directory.children;
    }

    let f: any = [];
    if (directory.files.length > 0) {
        if (!(directory.files[0] instanceof Types.ObjectId))
            f = directory.files.map(f => toFileView(f as unknown as IFile));
        else
            f = directory.files;
    }

    let p: any = [];
    if (directory.parents.length > 0) {
        if (!(directory.parents[0] instanceof Types.ObjectId))
            p = directory.parents.map(p => toDirectoryView(p as unknown as IDirectory));
        else
            p = directory.parents;
    }

    let o: UserView = {id: "", username: "", email: "", organizations: new Map, verified: false};
    if (directory.owner != null) {
        if (!(directory.owner instanceof Types.ObjectId))
            o = toUserView(directory.owner as unknown as IUser);
        else
            o.id = directory.owner._id.toHexString();
    }

    return {
        id: directory._id.toHexString(),
        name: directory.name,
        owner: o,
        parents: p,
        children: c,
        files: f,
        type: "dir"
    };
}