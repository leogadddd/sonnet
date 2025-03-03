import { Doc } from "@/convex/_generated/dataModel";
import { create } from "zustand";

interface EditorStore {
  isLocked: boolean;
  setIsLocked: (isLocked: boolean) => void;

  isPublished: boolean;
  setIsPublished: (isPublished: boolean) => void;

  isShowOnExplore: boolean;
  setIsShowOnExplore: (isShowOnExplore: boolean) => void;

  currentBlog: Doc<"blogs"> | null;
  setCurrentBlog: (currentBlog: Doc<"blogs"> | null) => void;
}

export const useEditor = create<EditorStore>((set) => ({
  isLocked: false,
  setIsLocked: (isLocked: boolean) => set({ isLocked }),

  isPublished: false,
  setIsPublished: (isPublished: boolean) => set({ isPublished }),

  isShowOnExplore: false,
  setIsShowOnExplore: (isShowOnExplore: boolean) => set({ isShowOnExplore }),

  currentBlog: null,
  setCurrentBlog: (currentBlog: Doc<"blogs"> | null) => set({ currentBlog }),
}));
