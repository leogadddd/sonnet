"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useMutation } from "convex/react";
import {
  ChevronDown,
  ChevronRight,
  Globe,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Share,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { memo } from "react";
import { usePublish } from "@/hooks/use-publish";

interface ItemProps {
  id?: Id<"blogs">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  icon: LucideIcon;

  isSearch?: boolean;
  isSettings?: boolean;
}

const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
  isSettings,
}: ItemProps) => {
  const router = useRouter();
  const create = useMutation(api.blogs.create);
  const archive = useMutation(api.blogs.archive);
  const publish = usePublish();

  const onArchive = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      if (!id) return;

      router.push("/dashboard");
      const promise = archive({ id });

      toast.promise(promise, {
        loading: "Moving to trash...",
        success: "Blog moved to trash!",
        error: "Failed to archive blog.",
      });
    },
    [archive, id, router]
  );

  const handleExpand = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      onExpand?.();
    },
    [onExpand]
  );

  const onCreate = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      if (!id) return;

      const promise = create({ title: "New Page", parentBlog: id }).then(
        (documentId) => {
          if (!expanded) {
            onExpand?.();
          }
          router.push(`/dashboard/${documentId}`);
        }
      );

      toast.promise(promise, {
        loading: "Creating a new page...",
        success: "New page created!",
        error: "Failed to create a new page.",
      });
    },
    [create, expanded, id, onExpand, router]
  );

  const onPublish = useCallback(() => {
    publish.onOpen();
  }, [publish]);

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  // Memoize the context menu component
  const contextMenu = useMemo(
    () => (
      <Item.ContextMenu
        onArchive={onArchive}
        onPublish={onPublish}
        label={label}
      />
    ),
    [onArchive, label, onPublish]
  );

  return (
    <div
      onClick={onClick}
      role={"button"}
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-[26px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mx-1"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
      )}
      <span className={cn("truncate", active && "font-bold")}>{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-primary/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
      {isSettings && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-primary/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>/
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          {contextMenu}
          <div
            role="button"
            onClick={onCreate}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

Item.ContextMenu = memo(function ItemContextMenu({
  onArchive,
  onPublish,
  label,
}: {
  onArchive: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onPublish: () => void;
  label: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
        <div
          role="button"
          className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
        >
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="p-1 w-60 ml-10 bg-background dark:bg-[#181717] drop-shadow-md rounded-xl"
        align="start"
        side="right"
        alignOffset={-12}
        forceMount
      >
        <DropdownMenuItem
          className="cursor-pointer rounded-lg "
          onClick={onPublish}
        >
          <Share className="h-4 w-4 mr-2 " />
          Share <span className="truncate">"{label}"</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onArchive}
          className="cursor-pointer rounded-lg text-red-500 focus:text-red-400 pr-4"
        >
          <Trash className="h-4 w-4 mr-2 " />
          Delete <span className="truncate">"{label}"</span>
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last Edited by: {user?.fullName}
              </div> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

Item.Skeleton = function ItemSekeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};

export default Item;
