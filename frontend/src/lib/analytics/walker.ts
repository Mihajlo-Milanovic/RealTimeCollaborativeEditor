import type {Node as PMNode} from "@tiptap/pm/model";
import {DocumentVisitor, VisitFn} from "./types";

/**
 * Centralni mehanizam obilaska (GoF Visitor "object structure" + dispatch).
 *
 * Koristi postojeći ProseMirror API doc.descendants() — JEDAN prolaz kroz
 * stablo hrani SVE visitore. Dispatch je dinamički, po imenu tipa čvora
 * ("bulletList" -> visitBulletList), bez switch/if-else lanaca; ako visitor
 * nema namensku metodu, koristi se generički visitNode.
 */
export function walkDocument(doc: PMNode, visitors: DocumentVisitor[]): void {
    for (const v of visitors) v.begin?.(doc);

    doc.descendants((node, pos, parent) => {
        const methodName = `visit${pascal(node.type.name)}`;
        for (const visitor of visitors) {
            const method =
                (visitor as unknown as Record<string, VisitFn | undefined>)[methodName]
                ?? visitor.visitNode;
            method?.call(visitor, node, pos, parent);
        }
        return true; // nastavi u dubinu
    });

    for (const v of visitors) v.end?.();
}

function pascal(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
}
