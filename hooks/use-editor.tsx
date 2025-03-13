import { create } from "zustand";

type EditorStore = {
  saveStatus: "unsaved" | "saved" | "error";
  setSaveStatus: (saveStatus: "unsaved" | "saved" | "error") => void;

  characterCount: number;
  setCharacterCount: (characterCount: number) => void;
};

export const useEditor = create<EditorStore>((set) => ({
  saveStatus: "saved",
  setSaveStatus: (saveStatus) => set({ saveStatus }),

  characterCount: 0,
  setCharacterCount: (characterCount) => set({ characterCount }),
}));
