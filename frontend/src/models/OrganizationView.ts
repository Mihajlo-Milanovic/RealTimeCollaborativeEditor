export class OrganizationView {

    id: string;
    name: string;
    organizer: string;
    members: Map<string, string>;
    children?: Array<{ id: string; name: string }>

    constructor (
        id: string = "",
        name: string = "",
        organizer: string = "",
        members: Map<string, string> = new Map<string, string>(),
        children: Array<{ id: string; name: string }> = []
    ) {
        this.id = id;
        this.name = name;
        this.organizer = organizer;
        this.members = members;
        this.children = children;
    }



}
