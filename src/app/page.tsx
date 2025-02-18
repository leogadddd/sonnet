"use client";

import TailwindAdvancedEditor from "@/components/editor/tailwindeditor";

export default function Home() {
  return (
    <div className="">
      <TailwindAdvancedEditor
        context={{
          setEditor: () => {},
          setSaveState: () => {},
          setCharCount: () => {},
          content: "",
        }}
        onSave={() => {}}
      />
    </div>
  );
}
