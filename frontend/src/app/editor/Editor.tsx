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
            provider.awareness.setLocalState({
                username: user.username,
                color: getRandomColor(user.username),
            });

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



