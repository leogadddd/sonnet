"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorInstance,
  EditorRoot,
  ImageResizer,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel";
import { generateJSON } from "@tiptap/html";
import { defaultExtensions } from "@/components/editor/extensions";
import { uploadFn } from "@/components/editor/image.upload";
import {
  slashCommand,
  suggestionItems,
} from "@/components/editor/slash.command";
import GenerativeMenuSwitch from "@/components/editor/generative/generativemenu.switch";
import { Separator } from "@/components/editor/ui/seperator";
import { NodeSelector } from "@/components/editor/selectors/node.selector";
import { LinkSelector } from "@/components/editor/selectors/link.selector";
import { TextButtons } from "@/components/editor/selectors/text.buttons";
import { ColorSelector } from "@/components/editor/selectors/color.selector";

interface TailwindAdvancedEditorProps {
  context?: {
    setEditor?: (editor: EditorInstance | undefined) => void;
    setSaveState?: (state: string) => void;
    setCharCount?: (count: number) => void;
    content?: string;
  };
  onSave?: (content_html: string, content_json: JSONContent) => void;
  debounceDelay?: number;
}

const TailwindAdvancedEditor: React.FC<TailwindAdvancedEditorProps> = ({
  context = {},
  onSave,
  debounceDelay = 500,
}) => {
  const { setEditor, setSaveState, setCharCount, content } = context;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [initialContent, setInitialContent] = useState<JSONContent | undefined>(
    content
      ? generateJSON(content, [...defaultExtensions, slashCommand])
      : undefined
  );
  const [jsonContent, setJsonContent] = useState<JSONContent | undefined>(
    initialContent
  );

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  const handleSave = (editor: EditorInstance) => {
    const json = editor.getJSON();
    const html = editor.getHTML();
    setJsonContent(json);
    if (onSave) onSave(html, json);
    if (setCharCount) setCharCount(editor.storage.characterCount.words());
    if (setSaveState) setSaveState("Saved");
  };

  const debouncedUpdates = useDebouncedCallback(handleSave, debounceDelay);

  return (
    <div className="relative w-full min-h-full mt-24 flex">
      {/* Left: Rich Text Editor */}
      <div className="w-1/2 pr-2 mx-auto">
        <EditorRoot>
          <EditorContent
            autofocus
            extensions={[...defaultExtensions, slashCommand]}
            initialContent={jsonContent}
            className="relative min-h-[500px] w-full mx-auto max-w-screen-lg border-muted bg-background"
            onCreate={({ editor }) => setEditor?.(editor)}
            onDestroy={() => setEditor?.(undefined)}
            onUpdate={({ editor }) => {
              debouncedUpdates(editor);
              setSaveState?.("Unsaved");
            }}
            editorProps={{
              handleDOMEvents: {
                keydown: (_view, event) => handleCommandNavigation(event),
              },
              handlePaste: (view, event) =>
                handleImagePaste(view, event, uploadFn),
              handleDrop: (view, event, _slice, moved) =>
                handleImageDrop(view, event, moved, uploadFn),
              attributes: {
                class:
                  "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
              },
            }}
            slotAfter={<ImageResizer />}
          >
            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-xl border border-[--color-dark-accent-2] bg-[--color-dark] px-2 pr-3 py-2 shadow-md transition-all">
              <EditorCommandEmpty className="px-2 text-muted-foreground">
                No results
              </EditorCommandEmpty>
              <EditorCommandList>
                {suggestionItems.map((item) => (
                  <EditorCommandItem
                    key={item.title}
                    value={item.title}
                    onCommand={(val) => item.command?.(val)}
                    className="flex w-full items-center space-x-2 rounded-md px-4 pr-6 py-1 text-left text-sm hover:bg-[--color-dark-accent] aria-selected:bg-[--color-dark-accent]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-[--color-dark-accent-3]">
                        {item.description}
                      </p>
                    </div>
                  </EditorCommandItem>
                ))}
              </EditorCommandList>
            </EditorCommand>
            <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
              <Separator orientation="vertical" />
              <NodeSelector open={openNode} onOpenChange={setOpenNode} />
              <Separator orientation="vertical" />
              <LinkSelector open={openLink} onOpenChange={setOpenLink} />
              <Separator orientation="vertical" />
              <TextButtons />
              <Separator orientation="vertical" />
              <ColorSelector open={openColor} onOpenChange={setOpenColor} />
            </GenerativeMenuSwitch>
          </EditorContent>
        </EditorRoot>
      </div>
    </div>
  );
};

export default TailwindAdvancedEditor;
