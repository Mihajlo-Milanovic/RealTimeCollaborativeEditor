import type {Node as PMNode} from "@tiptap/pm/model";

/** Jedna izračunata metrika za prikaz u panelu. */
export interface MetricValue {
    label: string;
    value: string | number;
}

/** Rezultat jednog visitora — sekcija u Live Analytics panelu. */
export interface AnalyticsSection {
    id: string;
    title: string;
    metrics: MetricValue[];
}

export type VisitFn = (node: PMNode, pos: number, parent: PMNode | null) => void;

/**
 * GoF Visitor interfejs nad ProseMirror stablom.
 *
 * ProseMirror čvorovi su tuđe klase (nemaju accept()), pa double-dispatch
 * izvodi centralni Walker: za svaki čvor poziva metodu visitora izvedenu iz
 * imena tipa čvora ("paragraph" -> visitParagraph), a ako je nema — visitNode.
 * Svaki visitor implementira SAMO metode koje ga zanimaju.
 */
export interface DocumentVisitor {
    readonly id: string;
    readonly title: string;

    /** Poziva se jednom pre obilaska. */
    begin?(doc: PMNode): void;
    /** Poziva se jednom posle obilaska. */
    end?(): void;

    /** Fallback za tipove čvorova bez namenske metode. */
    visitNode?: VisitFn;

    // Namenske visit metode po tipu čvora (dinamički dispatch po imenu):
    visitText?: VisitFn;
    visitParagraph?: VisitFn;
    visitHeading?: VisitFn;
    visitBulletList?: VisitFn;
    visitOrderedList?: VisitFn;
    visitListItem?: VisitFn;
    visitBlockquote?: VisitFn;
    visitCodeBlock?: VisitFn;
    visitImage?: VisitFn;

    /** Rezultat merenja nakon obilaska. */
    snapshot(): MetricValue[];
}
