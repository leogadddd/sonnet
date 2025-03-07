"use client";

import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  ImageResizer,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./novel/extensions";
import { ColorSelector } from "./novel/selectors/color-selector";
import { LinkSelector } from "./novel/selectors/link-selector";
import { MathSelector } from "./novel/selectors/math-selector";
import { NodeSelector } from "./novel/selectors/node-selector";
import { Separator } from "./novel/ui/separator";

import GenerativeMenuSwitch from "./novel/generative/generative-menu-switch";
import { uploadFn } from "./novel/image-upload";
import { TextButtons } from "./novel/selectors/text-buttons";
import { slashCommand, suggestionItems } from "./novel/slash-command";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const hljs = require("highlight.js");

const poppins = Poppins({
  subsets: ["latin"], // Ensures support for Latin characters
  weight: ["400", "700"], // Specifies the font weights you need
  variable: "--font-poppins", // Defines a CSS variable for global usage
});

const extensions = [...defaultExtensions, slashCommand];

interface EditorV2Props {
  editable?: boolean;
  initialContent: string;
  onChange: (content: string) => void;
}

const TailwindAdvancedEditor = ({
  editable = true,
  initialContent,
  onChange,
}: EditorV2Props) => {
  const [content, setContent] = useState<JSONContent | null>(
    initialContent ? JSON.parse(initialContent) : null
  );
  const [editor, setEditor] = useState<EditorInstance | undefined>(undefined);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState();

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // @ts-ignore
      // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      setCharsCount(editor.storage.characterCount.words());
      onChange(JSON.stringify(json));
      setSaveStatus("Saved");
    },
    500
  );

  // if editable is changed, update the editor
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editable]);

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(initialContent);
    }
  }, [editor]);

  return (
    <div className="relative w-full max-w-screen-lg">
      <EditorRoot>
        <EditorContent
          initialContent={content ?? undefined}
          extensions={extensions}
          editable={editable}
          onCreate={(editor) => {
            setEditor(editor.editor);
          }}
          className={cn(
            poppins.className,
            "relative min-h-[500px] w-full max-w-screen-lg sm:mb-[calc(20vh)]"
          )}
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
                "prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-[99999] h-auto max-h-[330px] w-[300px] overflow-y-auto rounded-lg border border-muted bg-[#181717] p-2 pr-3 transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className="group cursor-pointer flex w-full items-center space-x-2 rounded-lg px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-transparent transition-all group-hover:scale-125 group-aria-selected:scale-125">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground/50">
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
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default TailwindAdvancedEditor;
