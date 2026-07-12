import {useEffect, useState} from "react";
import type {Editor} from "@tiptap/react";
import {AnalyticsSection} from "./types";
import {walkDocument} from "./walker";
import {createVisitors} from "./registry";

/**
 * Live rekalkulacija bez pollinga: Tiptap "update" event se okida i za lokalne
 * i za REMOTE (Yjs) transakcije, pa se visitori automatski ponovo pokreću kad
 * bilo koji korisnik promeni dokument. Debounce štiti od preračunavanja na
 * svaki karakter.
 */
export function useLiveAnalytics(editor: Editor | null): AnalyticsSection[] {
    const [sections, setSections] = useState<AnalyticsSection[]>([]);

    useEffect(() => {
        if (!editor) return;

        let timer: ReturnType<typeof setTimeout> | undefined;

        const recalc = () => {
            const visitors = createVisitors();
            walkDocument(editor.state.doc, visitors);
            setSections(visitors.map((v) => ({
                id: v.id,
                title: v.title,
                metrics: v.snapshot(),
            })));
        };

        const schedule = () => {
            clearTimeout(timer);
            timer = setTimeout(recalc, 250);
        };

        recalc(); // inicijalni proračun
        editor.on("update", schedule);

        return () => {
            clearTimeout(timer);
            editor.off("update", schedule);
        };
    }, [editor]);

    return sections;
}
