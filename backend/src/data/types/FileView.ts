import {PlainResource} from "./PlainResource";
import {IFile} from "../interfaces/IFile";
import {toUserView, UserView} from "./UserView";
import {IUser} from "../interfaces/IUser";


export type FileView = PlainResource<IFile, "parent" | "owner">
    & {owner: UserView};

export function toFileView(file: IFile): FileView {

    return {
        id: file.id,
        name: file.name,
        owner: toUserView(file.owner as unknown as IUser),
        yDocState: file.yDocState,
        version: file.version,
        comments: [],
    }
}