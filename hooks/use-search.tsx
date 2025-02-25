import { create } from "zustand";

type SearchStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
};

export const useSearch = create<SearchStore>((set, get) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }), // ✅ Use set()
  onClose: () => set({ isOpen: false }), // ✅ Use set()
  toggle: () => set({ isOpen: !get().isOpen }),
}));
