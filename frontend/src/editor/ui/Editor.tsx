'use client';


import {SimpleEditor} from "@/components/tiptap-templates/simple/simple-editor";


export default function Editor(
    {
        selectedFileId
    }: {
        selectedFileId: string | null
    }
) {

    return (<>
            {selectedFileId != null ? (
                <SimpleEditor
                    key={selectedFileId}
                    fileId={selectedFileId}
                />
            ) : (
                <div className={"flex-1 flex items-center justify-center text-slate-500"}>
                    <p>Choose a file for editing</p>
                </div>
            )}
        </>
    )

}
