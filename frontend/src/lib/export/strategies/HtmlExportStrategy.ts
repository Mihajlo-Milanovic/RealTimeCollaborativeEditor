import {ExportDocument, ExportStrategy} from "../types";

/** Izvoz u samostalni .html fajl (ne zahteva biblioteku). */
export class HtmlExportStrategy implements ExportStrategy {
    readonly format = "html";
    readonly label = "HTML";
    readonly extension = "html";
    readonly mimeType = "text/html";

    async export(doc: ExportDocument): Promise<Blob> {
        const title = escapeHtml(doc.title);
        const page =
            `<!DOCTYPE html>\n` +
            `<html lang="en">\n<head>\n<meta charset="utf-8"/>\n` +
            `<title>${title}</title>\n</head>\n` +
            `<body>\n${doc.html}\n</body>\n</html>\n`;
        return new Blob([page], {type: this.mimeType});
    }
}

function escapeHtml(s: string): string {
    return s.replace(/[&<>"]/g, (c) =>
        ({"&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;"}[c] as string)
    );
}
