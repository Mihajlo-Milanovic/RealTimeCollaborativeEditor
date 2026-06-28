import {ExportDocument, ExportStrategy} from "../types";

/**
 * Izvoz u Markdown (.md).
 * Biblioteka: "turndown" — mali, proveren HTML→Markdown konverter koji radi u
 * browseru; izbegava ručno pisanje (i bagovanje) konverzije. Učitava se lenjo.
 */
export class MarkdownExportStrategy implements ExportStrategy {
    readonly format = "md";
    readonly label = "Markdown";
    readonly extension = "md";
    readonly mimeType = "text/markdown";

    async export(doc: ExportDocument): Promise<Blob> {
        const {default: TurndownService} = await import("turndown");
        const turndown = new TurndownService({
            headingStyle: "atx",
            codeBlockStyle: "fenced",
        });
        const md = turndown.turndown(doc.html);
        return new Blob([md], {type: this.mimeType});
    }
}
