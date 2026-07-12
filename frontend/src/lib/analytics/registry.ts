import {DocumentVisitor} from "./types";
import {TextStatsVisitor} from "./visitors/TextStatsVisitor";
import {StructureVisitor} from "./visitors/StructureVisitor";
import {ReadingTimeVisitor} from "./visitors/ReadingTimeVisitor";

/**
 * JEDINO mesto registracije visitora. Nova metrika = nova Visitor klasa +
 * jedna linija ovde; postojeći visitori, walker i UI se NE menjaju (OCP).
 */
export function createVisitors(): DocumentVisitor[] {
    return [
        new TextStatsVisitor(),
        new StructureVisitor(),
        new ReadingTimeVisitor(),
    ];
}
