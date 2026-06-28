/**
 * ProseMirror/Tiptap JSON čvor — strukturni oblik koji vraća editor.getJSON().
 */
export interface PMNode {
    type?: string;
    text?: string;
    marks?: Array<{ type: string; attrs?: Record<string, any> }>;
    attrs?: Record<string, any>;
    content?: PMNode[];
}

/**
 * JEDINSTVENI ulaz koji svaka strategija dobija. Strategije NE čitaju iz editora —
 * dobijaju serijalizovano stanje dokumenta (html + ProseMirror JSON) + naslov.
 * Svaka strategija koristi onaj oblik koji joj najviše odgovara (npr. MD iz html,
 * PDF/DOCX iz json).
 */
export interface ExportDocument {
    title: string;
    html: string;
    json: PMNode;
}

/**
 * Zajednički interfejs svih strategija izvoza (GoF Strategy).
 * Sve strategije su međusobno zamenljive — isti ulaz, isti izlaz (Blob fajla).
 */
export interface ExportStrategy {
    /** jedinstveni ključ formata, npr. "pdf" */
    readonly format: string;
    /** naziv za UI, npr. "PDF" */
    readonly label: string;
    /** ekstenzija fajla, npr. "pdf" */
    readonly extension: string;
    /** MIME tip generisanog fajla */
    readonly mimeType: string;

    export(doc: ExportDocument): Promise<Blob>;
}
