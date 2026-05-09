import React from 'react';
import { Spacer } from "@/app/editor/components/tiptap-ui-primitive/spacer";
import { Toolbar as TiptapToolbar, ToolbarGroup, ToolbarSeparator } from "@/app/editor/components/tiptap-ui-primitive/toolbar";
import { UndoRedoButton } from "@/app/editor/components/tiptap-ui/undo-redo-button";
import { HeadingDropdownMenu } from "@/app/editor/components/tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "@/app/editor/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/app/editor/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/app/editor/components/tiptap-ui/code-block-button";
import { TextAlignButton } from "@/app/editor/components/tiptap-ui/text-align-button";

interface ToolbarProps {
    isMobile?: boolean;
    onHighlighterClick?: () => void;
    onLinkClick?: () => void;
}

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(({ isMobile, onHighlighterClick, onLinkClick }, ref) => {
    return (
        <TiptapToolbar ref={ref}>
            <Spacer />
            <ToolbarGroup>
                <UndoRedoButton action="undo" />
                <UndoRedoButton action="redo" />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
                <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />
                <BlockquoteButton />
                <CodeBlockButton />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                <TextAlignButton align="left" />
                <TextAlignButton align="center" />
                <TextAlignButton align="right" />
                <TextAlignButton align="justify" />
            </ToolbarGroup>
            <Spacer />
        </TiptapToolbar>
    );
});

Toolbar.displayName = "Toolbar";

export default Toolbar;
