import type {Node as PMNode} from "@tiptap/pm/model";
import {DocumentVisitor, MetricValue} from "../types";

/** Broj karaktera (sa/bez razmaka) i broj reči — čita samo text čvorove. */
export class TextStatsVisitor implements DocumentVisitor {
    readonly id = "text";
    readonly title = "Text";

    private chars = 0;
    private charsNoSpaces = 0;
    private words = 0;

    begin(): void {
        this.chars = 0;
        this.charsNoSpaces = 0;
        this.words = 0;
    }

    visitText = (node: PMNode): void => {
        const text = node.text ?? "";
        this.chars += text.length;
        this.charsNoSpaces += text.replace(/\s/g, "").length;
        const matches = text.match(/[\p{L}\p{N}'’-]+/gu);
        this.words += matches ? matches.length : 0;
    };

    snapshot(): MetricValue[] {
        return [
            {label: "Words", value: this.words},
            {label: "Characters", value: this.chars},
            {label: "Characters (no spaces)", value: this.charsNoSpaces},
        ];
    }
}
