import {UserView} from "@/core/types/UserView";
import {OrganizationView} from "@/core/types/OrganizationView";


export type TOrganizationExplorer = {
    user: UserView,
    onSelectFileAction: (id: string) => void,
    onOpenMembersManagerAction: (organization: OrganizationView) => void,
    organizationsRefreshKey: number,
}