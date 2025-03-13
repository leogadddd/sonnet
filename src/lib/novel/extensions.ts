import {
  TiptapImage,
  TiptapLink,
  UpdatedImage,
  TaskList,
  TaskItem,
  HorizontalRule,
  StarterKit,
  Placeholder,
  GlobalDragHandle,
  CodeBlockLowlight,
} from "novel";

import { all, createLowlight } from "lowlight";

import { cx } from "class-variance-authority";

// TODO I am using cx here to get tailwind autocomplete working, idk if someone else can write a regex to just capture the class key in objects

// You can overwrite the placeholder with your own configuration
const placeholder = Placeholder.configure({
  showOnlyWhenEditable: true,
  placeholder: ({ node, editor }) => {
    const { state } = editor;
    const { doc } = state;

    // Find the first occurrence of the node in the document
    let pos = -1;
    doc.descendants((n, position) => {
      if (n === node) {
        pos = position;
        return false; // Stop searching
      }
    });

    if (pos !== -1) {
      const resolvedPos = doc.resolve(pos);

      // Get the parent node safely
      const depth = resolvedPos.depth;
      const parent = depth > 0 ? resolvedPos.node(depth - 1) : null;

      // Get the previous sibling safely
      let prevSibling = null;
      if (pos > 0) {
        const prevPos = doc.resolve(pos - 1);
        prevSibling = prevPos.nodeAfter;
      }

      const isInTask =
        (parent && parent.type.name === "taskItem") ||
        (prevSibling && prevSibling.type.name === "taskItem");

      if (isInTask) {
        return "Add a task...";
      }
    }

    // Default placeholders
    switch (node.type.name) {
      case "heading":
        return "Heading";
      case "codeBlock":
        return "Start typing code...";
      case "taskItem":
      case "taskList":
        return "";
      case "bulletList":
      case "orderedList":
        return "";
      default:
        return "Start typing or type / for commands...";
    }
  },
});

const starterKit = StarterKit.configure({
  heading: {
    levels: [1, 2, 3],
    HTMLAttributes: {
      class: "text-[#3f3f3f] dark:text-[#cfcfcf]",
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: "text-[#3f3f3f] dark:text-[#cfcfcf]",
    },
  },
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: "text-[#3f3f3f] dark:text-[#cfcfcf]",
  },
});

const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: "text-[#3f3f3f] dark:text-[#cfcfcf]",
  },
});

const lowlight = createLowlight(all);

const codeBlockLowlight = CodeBlockLowlight.configure({
  lowlight,
});

export const defaultExtensions = [
  placeholder,
  starterKit,
  GlobalDragHandle,
  taskList,
  taskItem,
  codeBlockLowlight,
  UpdatedImage,
];
