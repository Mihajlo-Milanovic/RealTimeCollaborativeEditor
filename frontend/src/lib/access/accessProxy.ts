import {cService} from "../../app/editor/comments/services/cService";
import {DocumentAction, isAllowed} from "./accessPolicy";
import {useAccessStore} from "./accessStore";

/**
 * Interfejs REALNOG SUBJEKTA (mutacioni sloj nad dokumentom/komentarima/reakcijama).
 * cService ga već strukturno implementira, pa je on realni subjekt.
 */
export interface IDocumentMutations {
    createComment(content: string, fileId: string, userId: string): Promise<boolean>;
    updateComment(commentId: string, content: string): Promise<boolean>;
    deleteComment(commentId: string): Promise<boolean>;
    addOrUpdateReaction(commentId: string, emoji: string, userId: string): Promise<boolean>;
    removeReaction(commentId: string, userId: string): Promise<boolean>;
}

/**
 * GoF PROTECTIVE PROXY.
 *
 * Ima ISTI interfejs kao realni subjekt (IDocumentMutations) i transparentno ga
 * zamenjuje: pre delegiranja proverava da li trenutna uloga sme akciju.
 * - dozvoljeno  -> delegira realnom subjektu (cService),
 * - zabranjeno  -> odbija (vraća false), bez izvršavanja mutacije.
 *
 * Ovo je JEDINA tačka odluke o pristupu na frontendu — komponente ne zovu
 * cService direktno niti same proveravaju privilegije; sve ide kroz Proxy.
 * Metoda can() izlaže istu odluku UI-ju (read-only editor, disabled dugmad).
 */
class DocumentAccessProxy implements IDocumentMutations {
    constructor(private readonly subject: IDocumentMutations) {}

    private get role() {
        return useAccessStore.getState().role;
    }

    can(action: DocumentAction): boolean {
        return isAllowed(this.role, action);
    }

    private deny(action: DocumentAction): false {
        console.warn(`[AccessProxy] Odbijeno: "${action}" za ulogu "${this.role ?? "none"}".`);
        return false;
    }

    async createComment(content: string, fileId: string, userId: string): Promise<boolean> {
        if (!this.can("comment:add")) return this.deny("comment:add");
        return this.subject.createComment(content, fileId, userId);
    }

    async updateComment(commentId: string, content: string): Promise<boolean> {
        if (!this.can("comment:edit")) return this.deny("comment:edit");
        return this.subject.updateComment(commentId, content);
    }

    async deleteComment(commentId: string): Promise<boolean> {
        if (!this.can("comment:delete")) return this.deny("comment:delete");
        return this.subject.deleteComment(commentId);
    }

    async addOrUpdateReaction(commentId: string, emoji: string, userId: string): Promise<boolean> {
        if (!this.can("reaction:add")) return this.deny("reaction:add");
        return this.subject.addOrUpdateReaction(commentId, emoji, userId);
    }

    async removeReaction(commentId: string, userId: string): Promise<boolean> {
        if (!this.can("reaction:remove")) return this.deny("reaction:remove");
        return this.subject.removeReaction(commentId, userId);
    }
}

// Realni subjekt je postojeći cService; Proxy ga omotava.
export const accessProxy = new DocumentAccessProxy(cService);
