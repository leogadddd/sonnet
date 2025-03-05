import { create } from "zustand";

type MenuStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
};

export const useMenu = create<MenuStore>((set, get) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }), // ✅ Use set()
  onClose: () => set({ isOpen: false }), // ✅ Use set()
  toggle: () => set({ isOpen: !get().isOpen }),
}));
