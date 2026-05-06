import {UserView} from "@/models/types/views/UserView";
import {OrganizationView} from "@/models/types/views/OrganizationView";


export type TOrganizationExplorer = {
    user: UserView,
    onSelectFileAction: (id: string) => void,
    onOpenMembersManagerAction: (organization: OrganizationView) => void,
    organizationsRefreshKey: number,
}