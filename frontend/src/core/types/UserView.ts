import {FileNode} from "@/core/types/FileNode";
import {fsService} from "@/filesystem/services/fsService";


export class UserView {
    id: string;
    email: string;
    username: string;
    organizations: Map<string, string>;
    rootDir: FileNode | null;

    constructor(
        id: string = "",
        email: string = "",
        username: string = "",
        organizations: Map<string, string> = new Map<string, string>()
    ) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.organizations = organizations;
        this.rootDir = null;
        fsService.getRootDirectory(id).then( value => {
            this.rootDir = value
        });

    }
}