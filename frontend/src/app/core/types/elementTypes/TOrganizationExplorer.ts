import {UserView} from "@/app/core/types/UserView";
import {OrganizationView} from "@/app/core/types/OrganizationView";


export type TOrganizationExplorer = {
    user: UserView,
    onSelectFileAction: (id: string) => void,
    onOpenMembersManagerAction: (organization: OrganizationView) => void,
    organizationsRefreshKey: number,
}