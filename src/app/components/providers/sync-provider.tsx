"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useRef,
} from "react";
import { useDexie } from "./dexie-provider";
import { createClient } from "@/lib/supabase/client";
import useUser from "@/hooks/use-user";
import BlogSyncManager from "@/lib/sync/blogsync-manager";
import { toast } from "sonner";

const SYNC_INTERVAL = 1000 * 60 * 5; // 5 minutes
const SYNC_DEBOUNCE = 1000 * 10; // 10 seconds minimum between syncs
const isSyncRunning = new Set();
const lastSyncAttempt = { timestamp: 0 };

export function useAutoSync(
  checkSyncRequired: () => Promise<boolean>,
  performSync: () => Promise<void>
) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    if (isSyncRunning.has("autoSync")) return;
    isSyncRunning.add("autoSync");
    isMounted.current = true;

    const syncHandler = async () => {
      if (document.visibilityState !== "visible") return;

      const now = Date.now();
      if (now - lastSyncAttempt.timestamp < SYNC_DEBOUNCE) {
        if (isMounted.current) {
          intervalRef.current = setTimeout(syncHandler, SYNC_INTERVAL);
        }
        return;
      }

      try {
        const shouldSync = await checkSyncRequired();
        if (shouldSync) {
          await performSync();
          lastSyncAttempt.timestamp = Date.now(); // Ensure timestamp updates only on success
        }
      } catch (error) {
        console.error("Sync check failed:", error);
      }

      if (isMounted.current) {
        intervalRef.current = setTimeout(syncHandler, SYNC_INTERVAL);
      }
    };

    intervalRef.current = setTimeout(syncHandler, 500);

    return () => {
      isMounted.current = false;
      if (intervalRef.current) clearTimeout(intervalRef.current);
      isSyncRunning.delete("autoSync");
    };
  }, [checkSyncRequired, performSync]);
}

type SyncContextType = {
  cloudSync: boolean;
  last_synced: number | null;
  setCloudSync: (cloudSync: boolean) => void;
  syncSingleBlog: (blogId: string) => void;
  checkSync: () => void;
  sync: () => void;
  syncState: "synced" | "syncing" | "error" | "checking";
};

const SyncContext = createContext<SyncContextType | null>(null);

export const SyncProvider = ({ children }: { children: ReactNode }) => {
  const [cloudSync, setCloudSync] = useState(false);
  const [syncState, setSyncState] = useState<
    "synced" | "syncing" | "error" | "checking"
  >("synced");
  const [lastSynced, setLastSynced] = useState<number | null>(null);
  const { db } = useDexie();
  const supabase = createClient();
  const syncInProgressRef = useRef(false);
  const { user } = useUser();

  if (!db) {
    throw new Error("Provider must be within DexieProvider");
  }

  const getSyncManager = () => {
    if (!user) return null;
    return new BlogSyncManager(db, supabase, user.clerkId);
  };

  const sync = async () => {
    if (!user || syncInProgressRef.current) return;

    try {
      syncInProgressRef.current = true;
      setSyncState("syncing");

      const syncManager = getSyncManager();
      if (!syncManager) return;

      await syncManager.sync();

      const now = Date.now();
      localStorage.setItem("last_synced", now.toString());
      setLastSynced(now);
      setSyncState("synced");
    } catch (error) {
      console.error("Sync error:", error);
      setSyncState("error");
    } finally {
      syncInProgressRef.current = false;
    }
  };

  const syncSingleBlog = async (blogId: string) => {
    if (!user || syncInProgressRef.current) return;

    try {
      syncInProgressRef.current = true;
      setSyncState("syncing");

      const syncManager = getSyncManager();
      if (!syncManager) return;

      await syncManager.syncSingleBlog(blogId);

      const now = Date.now();
      localStorage.setItem("last_synced", now.toString());
      setLastSynced(now);
      setSyncState("synced");
    } catch (error) {
      console.error("Sync error:", error);
      setSyncState("error");
    } finally {
      syncInProgressRef.current = false;
    }
  };

  const checkSync = async () => {
    if (!user || syncInProgressRef.current) return;

    try {
      setSyncState("checking");

      const syncManager = getSyncManager();
      if (!syncManager) return;

      const needsSync = syncManager.needsSync();

      if (needsSync || lastSynced === null) {
        toast.promise(needsSync, {
          loading: "Checking for updates...",
          success: "Synced",
          error: "Error syncing",
          style: {
            height: "25px",
            width: "fit-content",
          },
        });
        await sync();
      } else {
        setSyncState("synced");
      }
    } catch (error) {
      console.error("Check sync error:", error);
      setSyncState("error");
    }
  };

  useEffect(() => {
    if (!user) return;

    sync(); // Always force sync on new instance load

    const storedLastSynced = parseInt(
      localStorage.getItem("last_synced") || "0",
      10
    );
    setLastSynced(storedLastSynced);

    const timer = setTimeout(() => {
      checkSync();
    }, 1000);

    return () => clearTimeout(timer);
  }, [user?.clerkId]);

  useAutoSync(async () => {
    if (!user) return false;
    if (syncInProgressRef.current) return false;

    const syncManager = getSyncManager();
    if (!syncManager) return false;

    return await syncManager.needsSync();
  }, checkSync);

  return (
    <SyncContext.Provider
      value={{
        cloudSync,
        setCloudSync,
        syncSingleBlog,
        syncState,
        last_synced: lastSynced,
        checkSync,
        sync,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("useSync must be used within a SyncProvider");
  }
  return context;
};
