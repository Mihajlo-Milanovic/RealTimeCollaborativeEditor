import {PMNode} from "./types";

/**
 * Zajednički pomoćnici za čitanje ProseMirror JSON-a, da se logika ne duplira
 * po strategijama (koriste ih PDF i DOCX strategija).
 */

/** Sakupi čist tekst iz (ugnežđenog) inline sadržaja čvora. */
export function collectText(node: PMNode): string {
    if (node.text) return node.text;
    if (!node.content) return "";
    return node.content.map(collectText).join("");
}

export interface InlineRun {
    text: string;
    bold: boolean;
    italics: boolean;
    underline: boolean;
}

/** Sakupi inline "run-ove" sa osnovnim formatiranjem (za DOCX TextRun-ove). */
export function collectRuns(node: PMNode): InlineRun[] {
    if (node.text) {
        const marks = new Set((node.marks ?? []).map((m) => m.type));
        return [{
            text: node.text,
            bold: marks.has("bold"),
            italics: marks.has("italic"),
            underline: marks.has("underline"),
        }];
    }
    if (!node.content) return [];
    return node.content.flatMap(collectRuns);
}

/** Top-level blokovi dokumenta (deca "doc" čvora). */
export function blocksOf(doc: PMNode): PMNode[] {
    return doc.content ?? [];
}
