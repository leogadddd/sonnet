import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Highlighter,
  Quote,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  PaintBucket,
} from "lucide-react";
import { EditorInstance } from "novel";

export const bubbleTools = [
  {
    name: "bold",
    icon: Bold,
    command: (editor: EditorInstance) =>
      editor.chain().focus().toggleBold().run(),
    isActive: (editor: EditorInstance) => editor.isActive("bold"),
  },
  {
    name: "italic",
    icon: Italic,
    command: (editor: EditorInstance) =>
      editor.chain().focus().toggleItalic().run(),
    isActive: (editor: EditorInstance) => editor.isActive("italic"),
  },
  {
    name: "underline",
    icon: Underline,
    command: (editor: EditorInstance) =>
      editor.chain().focus().toggleUnderline().run(),
    isActive: (editor: EditorInstance) => editor.isActive("underline"),
  },
  {
    name: "strikethrough",
    icon: Strikethrough,
    command: (editor: EditorInstance) =>
      editor.chain().focus().toggleStrike().run(),
    isActive: (editor: EditorInstance) => editor.isActive("strike"),
  },
  {
    name: "code",
    icon: Code,
    command: (editor: EditorInstance) =>
      editor.chain().focus().toggleCode().run(),
    isActive: (editor: EditorInstance) => editor.isActive("code"),
  },
  {
    name: "highlight",
    icon: Highlighter,
    command: (editor: EditorInstance) =>
      editor.chain().focus().toggleHighlight().run(),
    isActive: (editor: EditorInstance) => editor.isActive("highlight"),
  },
  {
    name: "heading 1",
    icon: Heading1,
    command: (editor: EditorInstance) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor: EditorInstance) =>
      editor.isActive("heading", { level: 1 }),
  },
  {
    name: "heading 2",
    icon: Heading2,
    command: (editor: EditorInstance) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor: EditorInstance) =>
      editor.isActive("heading", { level: 2 }),
  },
  {
    name: "heading 3",
    icon: Heading3,
    command: (editor: EditorInstance) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor: EditorInstance) =>
      editor.isActive("heading", { level: 3 }),
  },
  {
    name: "blockquote",
    icon: Quote,
    command: (editor: EditorInstance) =>
      editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor: EditorInstance) => editor.isActive("blockquote"),
  },
  {
    name: "bullet list",
    icon: List,
    command: (editor: EditorInstance) =>
      editor.chain().focus().toggleBulletList().run(),
    isActive: (editor: EditorInstance) => editor.isActive("bulletList"),
  },
  {
    name: "ordered list",
    icon: ListOrdered,
    command: (editor: EditorInstance) =>
      editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor: EditorInstance) => editor.isActive("orderedList"),
  },
  {
    name: "text color",
    icon: PaintBucket,
    command: null, // Handle separately in the UI with a dropdown
    isActive: () => false, // This is a menu, so it's never "active"
    type: "color-picker",
  },
];
