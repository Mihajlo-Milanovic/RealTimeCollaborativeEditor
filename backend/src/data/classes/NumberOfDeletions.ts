export class NumberOfDeletions
{
    directoriesDeleted;
    filesDeleted;

    constructor(directoriesDeleted: number = 0, filesDeleted: number = 0) {
        this.directoriesDeleted = directoriesDeleted;
        this.filesDeleted = filesDeleted;
    }

    accumulate(other: NumberOfDeletions){
        this.directoriesDeleted = other.directoriesDeleted;
        this.filesDeleted = other.filesDeleted;
    }
}