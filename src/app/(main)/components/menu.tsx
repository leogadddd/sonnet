"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  LockIcon,
  MoreHorizontal,
  Pin,
  Share,
  Trash,
  Unlock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublish } from "@/hooks/use-publish";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import Blog from "@/lib/dexie/blog";
import { useDexie } from "@/app/components/providers/dexie-provider";
import { useMenu } from "@/hooks/use-menu";

interface MenuProps {
  initialData: Blog;
}

const Menu = ({ initialData }: MenuProps) => {
  const router = useRouter();
  const { actions, db } = useDexie();
  const publish = usePublish();
  const menu = useMenu();

  const onArchive = React.useCallback(() => {
    const promise = actions.blog.archive(initialData.blog_id);

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash",
      error: "Failed to move to trash",
    });

    router.push("/dashboard");
  }, [initialData, router]);

  // takes in a boolean and returns a promise
  const onLockToggle = React.useCallback(
    (isLocked: boolean) => {
      actions.blog.setPreview(initialData.blog_id, isLocked);
    },
    [initialData]
  );

  const onPinToggle = React.useCallback(async () => {
    menu.toggle();
    await actions.blog.setPinned(initialData.blog_id, !initialData.is_pinned);
  }, [initialData, menu]);

  if (initialData === undefined) {
    return <Menu.Skeleton />;
  }

  if (initialData === null) {
    return null;
  }

  const menuContent = React.useMemo(
    () => (
      <PopoverContent
        className="p-1 w-60 flex flex-col gap-y-1 bg-background dark:bg-[#181717] rounded-xl"
        align="end"
        forceMount
      >
        <div className="flex items-center justify-between gap-x-2 w-full p-1 px-2 py-2">
          <Label className="flex items-center gap-x-2">
            {initialData.is_preview !== 1 ? (
              <>
                <LockIcon className="h-4 w-4 mr-2" />
                Lock Blog
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                Unlock Blog
              </>
            )}
          </Label>
          <Switch
            checked={initialData.is_preview === 1}
            onCheckedChange={onLockToggle}
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
          />
        </div>
        <div
          className="cursor-pointer rounded-lg flex items-center gap-x-2 w-full p-1 px-2 hover:bg-muted"
          onClick={onPinToggle}
        >
          <Pin className="h-4 w-4 mr-2 " />
          {initialData.is_pinned === 1 ? "Unpin" : "Pin"}
        </div>
        <div
          className="cursor-pointer rounded-lg flex items-center gap-x-2 w-full p-1 px-2 hover:bg-muted"
          onClick={publish.onOpen}
        >
          <Share className="h-4 w-4 mr-2 " />
          Share
        </div>
        <div
          onClick={onArchive}
          className="cursor-pointer rounded-lg px-2 flex items-center gap-x-2 text-red-500 focus:text-red-400 pr-4 w-full p-1 hover:bg-muted"
        >
          <Trash className="h-4 w-4 mr-2 " />
          Delete
        </div>
      </PopoverContent>
    ),
    [onArchive, initialData, onLockToggle, publish]
  );

  return (
    <Popover open={menu.isOpen} onOpenChange={menu.toggle}>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} size={"sm"}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      {menuContent}
    </Popover>
  );
};

// eslint-disable-next-line react/display-name
Menu.Skeleton = () => {
  return <Skeleton className="h-8 w-8" />;
};

export default Menu;
