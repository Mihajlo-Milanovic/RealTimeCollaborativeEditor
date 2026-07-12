import type {Node as PMNode} from "@tiptap/pm/model";
import {DocumentVisitor, MetricValue} from "../types";

/**
 * Procenjeno vreme čitanja (~200 reči/min).
 * Namerno broji reči SAM (ne zavisi od TextStatsVisitor) — visitori su
 * nezavisni i pojedinačno uklonjivi/zamenljivi.
 */
export class ReadingTimeVisitor implements DocumentVisitor {
    readonly id = "reading";
    readonly title = "Reading";

    private static readonly WPM = 200;
    private words = 0;

    begin(): void {
        this.words = 0;
    }

    visitText = (node: PMNode): void => {
        const matches = (node.text ?? "").match(/[\p{L}\p{N}'’-]+/gu);
        this.words += matches ? matches.length : 0;
    };

    snapshot(): MetricValue[] {
        const minutes = this.words / ReadingTimeVisitor.WPM;
        const display =
            this.words === 0 ? "—"
                : minutes < 1 ? "< 1 min"
                    : `${Math.round(minutes)} min`;
        return [{label: "Reading time", value: display}];
    }
}
