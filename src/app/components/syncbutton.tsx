"use client";

import React, { useEffect, useState } from "react";
import { useSync } from "./providers/sync-provider";
import { TimeFormatter } from "@/lib/utils";
import { CloudAlert, Cloud, RefreshCcw } from "lucide-react";
import Item from "../(main)/components/item";
import { toast } from "sonner";

const SyncButton = () => {
  const { syncState, checkSync, last_synced } = useSync();
  const [lastSyncedText, setLastSyncedText] = useState<string | null>(null);

  useEffect(() => {
    const updateSyncTime = () => {
      if (last_synced) {
        setLastSyncedText(TimeFormatter.timeAgo(last_synced));
      }
    };

    updateSyncTime(); // Initial update
    const interval = setInterval(updateSyncTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup
  }, [last_synced]);

  return (
    <Item
      label={syncState === "synced" ? `synced ${lastSyncedText}` : syncState}
      onClick={checkSync}
      icon={
        syncState === "error"
          ? CloudAlert
          : syncState === "syncing"
            ? RefreshCcw
            : Cloud
      }
    />
  );
};

export const SyncText = () => {
  const { syncState, checkSync, last_synced } = useSync();
  const [lastSyncedText, setLastSyncedText] = useState<string | null>(null);

  // add a useEffect to add ctrl + s to save
  useEffect(() => {
    const handleSave = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        checkSync();
      }
    };

    window.addEventListener("keydown", handleSave);

    return () => window.removeEventListener("keydown", handleSave);
  }, [checkSync]);

  useEffect(() => {
    const updateSyncTime = () => {
      if (last_synced) {
        setLastSyncedText(TimeFormatter.timeAgo(last_synced));
      }
    };

    updateSyncTime();
    const interval = setInterval(updateSyncTime, 1000);

    return () => clearInterval(interval);
  }, [last_synced]);

  return (
    <button
      onClick={(event: React.MouseEvent) => {
        event.stopPropagation();
        checkSync();
      }}
      className="hover:underline focus:outline-none text-xs/3 text-muted-foreground/50 text-left"
    >
      {syncState === "synced" ? `synced ${lastSyncedText}` : syncState}
    </button>
  );
};

export default SyncButton;
