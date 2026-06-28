"use client";

import {useRef, useState} from "react";
import {createPortal} from "react-dom";
import {useCurrentEditor} from "@tiptap/react";
import {Download} from "lucide-react";
import {exportContext} from "../../lib/export/exportRegistry";
import {PMNode} from "../../lib/export/types";

/**
 * UI samo bira format i poziva Context. Ne zna kako se pojedini format generiše.
 * Lista formata se čita iz Context-a (exportContext.list()), pa novi format
 * automatski postaje vidljiv u meniju bez izmene ove komponente.
 *
 * Meni se renderuje kroz portal (position: fixed) jer toolbar ima overflow-x:auto
 * koji bi inače isekao apsolutno pozicioniran dropdown.
 */
export function ExportMenu() {
    const {editor} = useCurrentEditor();
    const btnRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [pos, setPos] = useState<{top: number; left: number} | null>(null);

    if (!editor) return null;

    const toggle = () => {
        if (open) {
            setOpen(false);
            return;
        }
        const r = btnRef.current?.getBoundingClientRect();
        if (r) setPos({top: r.bottom + 4, left: r.left});
        setOpen(true);
    };

    const handleExport = async (format: string) => {
        setOpen(false);
        setBusy(true);
        try {
            // Editor se čita SAMO ovde — strategije dobijaju serijalizovani ulaz.
            await exportContext.export(format, {
                title: "document",
                html: editor.getHTML(),
                json: editor.getJSON() as PMNode,
            });
        } catch (e) {
            console.error("Export failed:", e);
            alert("Izvoz nije uspeo.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onClick={toggle}
                disabled={busy}
                title="Export document"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-50"
            >
                <Download size={16}/>
                <span>{busy ? "Exporting…" : "Export"}</span>
            </button>

            {open && pos && createPortal(
                <>
                    {/* backdrop za zatvaranje klikom van menija */}
                    <div className="fixed inset-0 z-[999]" onClick={() => setOpen(false)}/>
                    <div
                        style={{position: "fixed", top: pos.top, left: pos.left}}
                        className="z-[1000] min-w-44 rounded-lg border border-slate-700 bg-slate-900 shadow-2xl p-1"
                    >
                        {exportContext.list().map((s) => (
                            <button
                                key={s.format}
                                type="button"
                                onClick={() => handleExport(s.format)}
                                className="w-full text-left px-3 py-1.5 rounded-md text-sm text-slate-200 hover:bg-slate-800 transition-colors"
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </>,
                document.body
            )}
        </>
    );
}
