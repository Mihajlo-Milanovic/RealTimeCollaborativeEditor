import {CommentView} from "../../../../models/types/views/CommentView";
import {ReactionType} from "../../../../models/types/ReactionType";
import {cService} from "../services/cService";

export type GroupedReaction = {
    type: ReactionType;
    count: number;
    mine: boolean;
};

/**
 * Reakcije su ugnežđene u comment.reactions, a CommentView se već sinhronizuje
 * kroz commentsStore (Y.Map<CommentView[]>). Zato OVDE ne držimo nikakav lokalni
 * state — sve IZVODIMO iz comment.reactions (jedan source of truth = shared Yjs
 * doc). Kada se reakcija promeni, REST upiše u DB, a onReactionChange()
 * (= useComments.refresh) re-fetch-uje pun niz i upiše ga u shared mapu, čime se
 * promena propagira SVIM klijentima (isti pattern kao dodavanje komentara).
 */
export const useReactions = (
    comment: CommentView,
    userId: string,
    onReactionChange: () => void | Promise<void>
) => {

    // Filtriramo eventualne neispravne/nepopulirane zapise (bez reactionType),
    // da se ne bi grupisali pod "undefined" u jedan pogrešan pill.
    const reactions = (comment.reactions ?? []).filter((r) => !!r?.reactionType);

    // Reakcija trenutnog korisnika (backend čuva jednu reakciju po korisniku).
    const myReaction = reactions.find((r) => r.reactor?.id === userId);
    const myReactionType: ReactionType | "" = myReaction?.reactionType ?? "";
    const alreadyReacted = !!myReaction;

    // Grupisanje po tipu emojija → jedan pill po distinct reakciji (npr. 👍 3, ❤️ 1).
    const counts = new Map<ReactionType, number>();
    reactions.forEach((r) => {
        counts.set(r.reactionType, (counts.get(r.reactionType) ?? 0) + 1);
    });
    const groupedReactions: GroupedReaction[] = Array.from(counts, ([type, count]) => ({
        type,
        count,
        mine: type === myReactionType,
    }));

    // Klik na emoji: ako je to već moja reakcija → ukloni, inače dodaj/zameni.
    // Backend (createOrUpdate / remove) je merge tačka; posle uspeha propagiramo.
    const toggleReaction = async (emoji: ReactionType) => {
        if (!userId) return;

        const ok = myReactionType === emoji
            ? await cService.removeReaction(comment.id, userId)
            : await cService.addOrUpdateReaction(comment.id, emoji, userId);

        if (ok) await onReactionChange();
    };

    return {
        groupedReactions,
        myReactionType,
        alreadyReacted,
        toggleReaction,
    };
};
