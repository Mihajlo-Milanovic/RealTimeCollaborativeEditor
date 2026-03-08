import {PlainResource} from "./PlainResource";
import {IOrganization} from "../interfaces/IOrganization";
import {toUserView, UserView} from "./UserView";
import {IUser} from "../interfaces/IUser";


export type OrganizationView = PlainResource<IOrganization, "organizer">
    & { organizer: UserView };

export function toOrganizationView(organization: IOrganization): OrganizationView{

    return {
        id: organization.id,
        name: organization.name,
        members: organization.members,//TODO: revisit
        organizer: toUserView(organization.organizer as unknown as IUser),
        children: organization.children,
        projections: organization.projections
    }
}