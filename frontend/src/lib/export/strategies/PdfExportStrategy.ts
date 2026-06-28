import {ExportDocument, ExportStrategy} from "../types";
import {blocksOf, collectText} from "../proseMirror";

/**
 * Izvoz u PDF.
 * Biblioteka: "jsPDF" — de-facto standard za generisanje PDF-a na klijentu.
 * Namerno BEZ html2canvas: prolazimo kroz ProseMirror JSON i upisujemo tekst,
 * pa dobijamo selektabilan tekst i izbegavamo tešku raster zavisnost.
 */
export class PdfExportStrategy implements ExportStrategy {
    readonly format = "pdf";
    readonly label = "PDF";
    readonly extension = "pdf";
    readonly mimeType = "application/pdf";

    async export(doc: ExportDocument): Promise<Blob> {
        const {jsPDF} = await import("jspdf");
        const pdf = new jsPDF({unit: "pt", format: "a4"});

        const marginX = 56;
        const marginTop = 64;
        const marginBottom = 64;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const maxWidth = pageWidth - marginX * 2;

        let y = marginTop;

        const write = (
            text: string,
            fontSize: number,
            bold: boolean,
            spacingAfter: number,
            indent = 0
        ) => {
            if (!text.trim()) {
                y += spacingAfter;
                return;
            }
            pdf.setFont("helvetica", bold ? "bold" : "normal");
            pdf.setFontSize(fontSize);
            const lines = pdf.splitTextToSize(text, maxWidth - indent);
            const lineHeight = fontSize * 1.35;
            for (const line of lines) {
                if (y + lineHeight > pageHeight - marginBottom) {
                    pdf.addPage();
                    y = marginTop;
                }
                pdf.text(line, marginX + indent, y);
                y += lineHeight;
            }
            y += spacingAfter;
        };

        for (const node of blocksOf(doc.json)) {
            switch (node.type) {
                case "heading": {
                    const level = node.attrs?.level ?? 1;
                    const size = level === 1 ? 22 : level === 2 ? 18 : 15;
                    write(collectText(node), size, true, 10);
                    break;
                }
                case "bulletList":
                case "orderedList": {
                    const ordered = node.type === "orderedList";
                    let i = 1;
                    for (const li of node.content ?? []) {
                        const prefix = ordered ? `${i++}. ` : "•  ";
                        write(prefix + collectText(li), 12, false, 4, 18);
                    }
                    y += 4;
                    break;
                }
                case "blockquote":
                    write(collectText(node), 12, false, 8, 18);
                    break;
                case "paragraph":
                default:
                    write(collectText(node), 12, false, 8);
            }
        }

        return pdf.output("blob");
    }
}
