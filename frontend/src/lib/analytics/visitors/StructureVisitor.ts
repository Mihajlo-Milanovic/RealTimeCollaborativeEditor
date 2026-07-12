import type {Node as PMNode} from "@tiptap/pm/model";
import {DocumentVisitor, MetricValue} from "../types";

/** Struktura dokumenta: pasusi, naslovi, liste, citati, kod, linkovi, slike. */
export class StructureVisitor implements DocumentVisitor {
    readonly id = "structure";
    readonly title = "Structure";

    private paragraphs = 0;
    private headings = 0;
    private listItems = 0;
    private blockquotes = 0;
    private codeBlocks = 0;
    private images = 0;
    private links = 0;
    private inLink = false; // uzastopni text čvorovi istog linka = 1 link

    begin(): void {
        this.paragraphs = 0;
        this.headings = 0;
        this.listItems = 0;
        this.blockquotes = 0;
        this.codeBlocks = 0;
        this.images = 0;
        this.links = 0;
        this.inLink = false;
    }

    visitParagraph = (): void => {
        this.paragraphs++;
    };

    visitHeading = (): void => {
        this.headings++;
    };

    visitListItem = (): void => {
        this.listItems++;
    };

    visitBlockquote = (): void => {
        this.blockquotes++;
    };

    visitCodeBlock = (): void => {
        this.codeBlocks++;
    };

    visitImage = (): void => {
        this.images++;
    };

    visitText = (node: PMNode): void => {
        const hasLink = node.marks.some((m) => m.type.name === "link");
        if (hasLink && !this.inLink) this.links++;
        this.inLink = hasLink;
    };

    snapshot(): MetricValue[] {
        return [
            {label: "Paragraphs", value: this.paragraphs},
            {label: "Headings", value: this.headings},
            {label: "List items", value: this.listItems},
            {label: "Blockquotes", value: this.blockquotes},
            {label: "Code blocks", value: this.codeBlocks},
            {label: "Links", value: this.links},
            {label: "Images", value: this.images},
        ];
    }
}
