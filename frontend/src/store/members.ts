import * as Y from "yjs";
import {OrganizationRole} from "../models/types/OrganizationRole";

/**
 * Realtime sync uloga članova organizacije — isti princip kao commentsStore i
 * fileSystemStore: backend je izvor istine, a sveže (backendom potvrđeno)
 * stanje se upisuje u shared Y.Map koju Hocuspocus prosledi svim klijentima
 * u sobi organizacije. Mapa "members" živi u ISTOM Yjs dokumentu sobe
 * organizacije koji već nosi "fileSystem" mapu (kao što dokument fajla nosi
 * i sadržaj i "comments"). Ključ = userId, vrednost = uloga.
 *
 * Razlika u odnosu na commentsStore: publisher (admin u "Manage members"
 * dijalogu) i subscriber (član sa izabranom organizacijom) mogu istovremeno
 * držati DVE različite sobe (dve organizacije), pa store nije singleton vezan
 * za jedan doc — funkcije primaju Y.Doc konkretne sobe.
 */
export const membersStore = {

    map(doc: Y.Doc): Y.Map<OrganizationRole> {
        return doc.getMap<OrganizationRole>("members");
    },

    /**
     * Uskladi shared mapu sa stanjem koje je backend potvrdio.
     * Upisuju se samo razlike, pa ponovljeni publish istog stanja
     * ne generiše nove Yjs update-e (nema beskonačne petlje observera).
     */
    publish(doc: Y.Doc, roles: Map<string, OrganizationRole>): void {
        const map = this.map(doc);
        doc.transact(() => {
            for (const userId of [...map.keys()]) {
                if (!roles.has(userId)) map.delete(userId);
            }
            roles.forEach((role, userId) => {
                if (map.get(userId) !== role) map.set(userId, role);
            });
        });
    },

    getRoles(doc: Y.Doc): Map<string, OrganizationRole> {
        return new Map(this.map(doc).entries());
    },

    /** Observer na svaku promenu mape; vraća unsubscribe funkciju. */
    subscribe(doc: Y.Doc, observer: () => void): () => void {
        const map = this.map(doc);
        const handler = () => observer();
        map.observe(handler);
        return () => map.unobserve(handler);
    },
};
