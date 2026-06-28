import {ExportDocument, ExportStrategy, PMNode} from "../types";
import {blocksOf, collectRuns} from "../proseMirror";

/**
 * Izvoz u DOCX (Word).
 * Biblioteka: "docx" (dolanmiu) — najproveren čisto-JS generator .docx-a koji
 * radi u browseru i vraća pravi .docx Blob (Packer.toBlob). Gradimo dokument iz
 * ProseMirror JSON-a, pa nema krhkog HTML→DOCX parsiranja. Učitava se lenjo.
 */
export class DocxExportStrategy implements ExportStrategy {
    readonly format = "docx";
    readonly label = "DOCX (Word)";
    readonly extension = "docx";
    readonly mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    async export(doc: ExportDocument): Promise<Blob> {
        const {Document, Packer, Paragraph, TextRun, HeadingLevel} = await import("docx");

        const runsOf = (node: PMNode) =>
            collectRuns(node).map((r) =>
                new TextRun({
                    text: r.text,
                    bold: r.bold,
                    italics: r.italics,
                    underline: r.underline ? {} : undefined,
                })
            );

        const headingFor = (level: number) =>
            level === 1 ? HeadingLevel.HEADING_1
                : level === 2 ? HeadingLevel.HEADING_2
                    : HeadingLevel.HEADING_3;

        const paragraphs: InstanceType<typeof Paragraph>[] = [];

        for (const node of blocksOf(doc.json)) {
            switch (node.type) {
                case "heading":
                    paragraphs.push(new Paragraph({
                        heading: headingFor(node.attrs?.level ?? 1),
                        children: runsOf(node),
                    }));
                    break;
                case "bulletList":
                    (node.content ?? []).forEach((li) => {
                        paragraphs.push(new Paragraph({bullet: {level: 0}, children: runsOf(li)}));
                    });
                    break;
                case "orderedList":
                    (node.content ?? []).forEach((li, idx) => {
                        paragraphs.push(new Paragraph({
                            children: [new TextRun({text: `${idx + 1}. `}), ...runsOf(li)],
                        }));
                    });
                    break;
                case "blockquote":
                case "paragraph":
                default:
                    paragraphs.push(new Paragraph({children: runsOf(node)}));
            }
        }

        const document = new Document({sections: [{children: paragraphs}]});
        return Packer.toBlob(document);
    }
}
