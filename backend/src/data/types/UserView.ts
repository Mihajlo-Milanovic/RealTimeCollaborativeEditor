import {PlainResource} from "./PlainResource";
import {IUser} from "../interfaces/IUser";


export type UserView = PlainResource<IUser, "password" | "verified" | "verificationToken">;

export function toUserView(user: IUser): UserView{
    return {
        id: user._id.toHexString(),
        username: user.username,
        email: user.email
    }
}