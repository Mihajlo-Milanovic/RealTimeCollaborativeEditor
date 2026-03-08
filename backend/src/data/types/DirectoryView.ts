import {PlainResource} from "./PlainResource";
import {IDirectory} from "../interfaces/IDirectory";
import {toUserView, UserView} from "./UserView";
import {IUser} from "../interfaces/IUser";


export type DirectoryView = PlainResource<IDirectory, "parents" | "owner">
    & {owner: UserView};

export function toDirectoryView(directory: IDirectory): DirectoryView {

    return {
        id: directory.id,
        name: directory.name,
        owner: toUserView(directory.owner as unknown as IUser),
        //parents: directory.parents,
        children: directory.children,
        files: directory.files,
    };
}