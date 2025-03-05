"use client"; // For Next.js App Router

import { createContext, useContext, ReactNode, useMemo } from "react";
import SonnetDB from "@/lib/dexie/SonnetDB";

import {
  blogActions,
  type BlogActions,
} from "@/lib/dexie/actions/blog-actions";

type DexieContextType = {
  db: SonnetDB;
  actions: {
    blog: BlogActions;
  };
};

const DexieContext = createContext<DexieContextType | null>(null);

export const DexieProvider = ({ children }: { children: ReactNode }) => {
  const db = useMemo(() => new SonnetDB(), []);

  const actions = useMemo(
    () => ({
      blog: blogActions,
    }),
    []
  );

  return (
    <DexieContext.Provider value={{ db, actions }}>
      {children}
    </DexieContext.Provider>
  );
};

export const useDexie = () => {
  const context = useContext(DexieContext);
  if (!context) throw new Error("useDexie must be used within a DexieProvider");
  return context;
};
