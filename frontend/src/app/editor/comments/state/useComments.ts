import {useEffect, useState} from "react";
import {useHocuspocusProvider} from "@hocuspocus/provider-react";
import {CommentView} from "../../../../models/types/views/CommentView";
import {cService} from "../services/cService";
import {accessProxy} from "../../../../lib/access/accessProxy";
import {commentsStore} from "../../../../store/comments";

export function useComments(fileId: string, userId: string) {

    // Provider konkretne sobe/fajla — isti shared Yjs dokument koji koristi Editor.
    const provider = useHocuspocusProvider();

    const [comments, setComments] = useState<CommentView[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newText, setNewText] = useState("");

    // Povuče komentare sa backenda (izvor istine) i upiše ih u shared Yjs mapu.
    // Time se promena propagira SVIM klijentima (njihov observe se okine).
    const fetchComments = async () => {
        if (!fileId) return;

        setIsLoading(true);
        const commentViews = await cService.getComments(fileId);
        commentsStore.setComments(fileId, commentViews);
        setIsLoading(false);
    };

    // Realtime subscribe na shared state (isti pattern kao useChildrenItems).
    useEffect(() => {
        if (!fileId || !provider?.document) return;

        // Inicijalizuj store deljenim dokumentom (idempotentno).
        commentsStore.init(provider.document);

        // Na svaku promenu shared mape za ovaj fileId – osveži lokalni UI state.
        const observer = () => setComments(commentsStore.getComments(fileId));
        commentsStore.subscribe(fileId, observer);

        // Inicijalno stanje:
        // - ako shared mapa već ima podatke (sinhronizovani od drugih) → prikaži ih,
        // - u suprotnom povuci sa backenda i seed-uj mapu (jednom).
        if (commentsStore.has(fileId)) {
            setComments(commentsStore.getComments(fileId));
        } else {
            fetchComments();
        }

        return () => {
            commentsStore.unsubscribe(observer);
        };
    }, [fileId, provider?.document]);

    const addComment = async () => {
        if (!newText.trim() || !userId) return;

        // Mutacija ide kroz Proxy (kontrola pristupa), ne direktno kroz cService.
        const success = await accessProxy.createComment(newText.trim(), fileId, userId);
        if (success) {
            setNewText("");
            // Persist je prošao → povuci pun niz i upiši u shared mapu → svi vide.
            await fetchComments();
        }
    };

    const updateComment = async (id: string, content: string) => {
        const success = await accessProxy.updateComment(id, content);
        if (success) await fetchComments();
    };

    const deleteComment = async (id: string) => {
        const success = await accessProxy.deleteComment(id);
        if (success) await fetchComments();
    };

    return {
        comments,
        isLoading,
        newText,
        setNewText,
        addComment,
        updateComment,
        deleteComment,
        refresh: fetchComments
    };
}
