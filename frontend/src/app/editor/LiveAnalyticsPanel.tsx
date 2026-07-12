"use client";

import {useState} from "react";
import {useCurrentEditor} from "@tiptap/react";
import {useHocuspocusAwareness} from "@hocuspocus/provider-react";
import {BarChart2, ChevronDown, ChevronUp} from "lucide-react";
import {useLiveAnalytics} from "../../lib/analytics/useLiveAnalytics";

/**
 * Live Analytics panel — plutajuća kartica u uglu editora.
 * Metrike računaju visitori (GoF Visitor) nad ProseMirror stablom; panel se
 * ažurira automatski na svaku (lokalnu ili remote) izmenu dokumenta.
 */
export function LiveAnalyticsPanel() {
    const {editor} = useCurrentEditor();
    const sections = useLiveAnalytics(editor);
    const awarenessUsers = useHocuspocusAwareness();
    const [open, setOpen] = useState(false);

    if (!editor) return null;

    return (
        <div className="fixed bottom-4 right-4 z-40 w-64 rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur-sm shadow-2xl text-slate-200">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold hover:bg-slate-800/60 rounded-xl transition-colors"
            >
                <span className="flex items-center gap-2">
                    <BarChart2 size={16} className="text-blue-400"/>
                    Live Analytics
                </span>
                {open ? <ChevronDown size={16}/> : <ChevronUp size={16}/>}
            </button>

            {open && (
                <div className="px-4 pb-4 space-y-4">
                    {/* Aktivni korisnici — iz postojećeg awareness mehanizma */}
                    <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                            Collaboration
                        </div>
                        <div className="flex justify-between text-xs py-0.5">
                            <span className="text-slate-400">Active users</span>
                            <span className="font-semibold">{awarenessUsers.length}</span>
                        </div>
                    </div>

                    {sections.map((section) => (
                        <div key={section.id}>
                            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                                {section.title}
                            </div>
                            {section.metrics.map((m) => (
                                <div key={m.label} className="flex justify-between text-xs py-0.5">
                                    <span className="text-slate-400">{m.label}</span>
                                    <span className="font-semibold">{m.value}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
