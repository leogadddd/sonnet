import { create } from "zustand";

type SonnetStore = {
  syncState: "synced" | "syncing" | "error";
  setSyncState: (syncState: "synced" | "syncing" | "error") => void;
};

export const useSonnet = create<SonnetStore>((set) => ({
  syncState: "synced",
  setSyncState: (syncState) => set({ syncState }),
}));
