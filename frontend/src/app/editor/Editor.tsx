'use client';

import {EditorInner} from "./components/tiptap-templates/simple/simple-editor";
import {useHocuspocusProvider,} from "@hocuspocus/provider-react";
import {useEffect} from "react";
import {OnlineUsers} from "./components/OnlineUsers";
import {user} from "../../store/user";
import {getRandomColor} from "../../lib/awarenessColors";

function Editor() {

    const provider = useHocuspocusProvider();

    useEffect(() => {

        provider.document.autoLoad = true;

        if (provider.awareness) {
            // Ovaj effect se izvršava tek kad je user store učitan (EditorPage
            // renderuje editor samo kad isLoading=false), pa je user.username siguran.
            const username = user.username || "Anonymous";
            const color = getRandomColor(username);

            // Koristimo setLocalStateField (merge), ne setLocalState (replace),
            // da polja koja postavljaju različiti sistemi koegzistiraju:
            // - "username"/"color" čita OnlineUsers (kružić u listi),
            // - "user" čita CollaborationCursor (ime + boja kursora u editoru).
            // "user" postavljamo i ovde jer ga ekstenzija inicijalno upiše dok
            // user store još nije spreman, pa bi ime palo na y-prosemirror
            // fallback "User: <clientId>". Ovde ga prepisujemo ispravnim imenom.
            provider.awareness.setLocalStateField("username", username);
            provider.awareness.setLocalStateField("color", color);
            provider.awareness.setLocalStateField("user", {name: username, username, color});
        }
        console.log("PROVIDER: ", provider);
    }, [provider]);

    return (<>

            <div className="editor-wrapper">
                <OnlineUsers/>
                <EditorInner/>
            </div>

        </>
    );
}

export default Editor;



