'use client';

import {EditorInner} from "@/app/editor/components/tiptap-templates/simple/simple-editor";
import {HocuspocusRoom} from "@hocuspocus/provider-react";


//Tiptap

import {useSelectedFile} from "@/store/selectedFile";

export default function Editor(
    {username}: { username: string }
) {

    const {selectedFileId} = useSelectedFile();

    return (<>

            {!selectedFileId && (
                <div className="p-4 text-sm text-gray-400">Collaborate with ease</div>
            )}

            {selectedFileId && (
                <HocuspocusRoom name={selectedFileId}>
                    <div className="editor-wrapper">
                        <EditorInner username={username}/>
                    </div>
                </HocuspocusRoom>
            )}
        </>
    );
}
