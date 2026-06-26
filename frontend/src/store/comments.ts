import * as Y from "yjs";
import {YMapEvent} from "yjs";
import {CommentView} from "../models/types/views/CommentView";

/**
 * Realtime store za komentare — direktna kopija pattern-a iz fileSystemStore.
 *
 * Shared state je Y.Map<CommentView[]> u ISTOM Yjs dokumentu (provider.document)
 * koji već koristi Editor za konkretan fajl/sobu. Ključ mape je fileId, vrednost
 * je ceo niz komentara za taj fajl (kao fsMap: parentId -> FileNode[]).
 *
 * Zašto Y.Map<CommentView[]> a ne Y.Array:
 * - 1:1 sa postojećim file system sync-om (Y.Map keyed po id-u + immutable
 *   zamena celog niza),
 * - backend (DB) je izvor istine; posle svake izmene klijent re-fetch-uje pun
 *   niz i upiše ga u mapu, pa se stanje konvergira ka DB-u (last-write-wins po
 *   ključu) bez overwrite-a tuđih izmena (svako upisuje sveže povučen niz).
 */
class CommentsStore {
    private static instance: CommentsStore;

    private _doc: Y.Doc | null = null;
    private _map: Y.Map<CommentView[]> | null = null;
    private _observers = new Map<() => void, (event: YMapEvent<CommentView[]>) => void>();

    static getInstance(): CommentsStore {
        if (!CommentsStore.instance) {
            CommentsStore.instance = new CommentsStore();
        }
        return CommentsStore.instance;
    }

    init(doc: Y.Doc): void {
        // Re-init samo ako se dokument promenio (npr. promena fajla/sobe).
        if (this._doc === doc) return;
        this._doc = doc;
        this._map = doc.getMap("comments");
    }

    get initialized(): boolean {
        return !!this._doc && !!this._map;
    }

    get cMap(): Y.Map<CommentView[]> | null {
        return this._map;
    }

    has(fileId: string): boolean {
        return this._map?.has(fileId) ?? false;
    }

    getComments(fileId: string): CommentView[] {
        return this._map?.get(fileId) ?? [];
    }

    /**
     * Immutable upis: uvek upisujemo NOV niz (kao fileSystemStore.fsMap.set),
     * čime Yjs propagira promenu svim klijentima.
     */
    setComments(fileId: string, comments: CommentView[]): void {
        if (!this._map) return;
        this._map.set(fileId, [...comments]);
    }

    subscribe(fileId: string, observer: () => void): void {
        if (!this._map) return;
        const handler = (event: YMapEvent<CommentView[]>) => {
            event.keys.forEach((_, key) => {
                if (key === fileId) observer();
            });
        };
        this._observers.set(observer, handler);
        this._map.observe(handler);
    }

    unsubscribe(observer: () => void): void {
        const handler = this._observers.get(observer);
        if (handler && this._map) {
            this._map.unobserve(handler);
            this._observers.delete(observer);
        }
    }
}

export const commentsStore = CommentsStore.getInstance();
