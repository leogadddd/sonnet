"use client";

import React, { useEffect, useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";

import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LockIcon, MoreHorizontal, Share, Trash, Unlock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublish } from "@/hooks/use-publish";
import { useEditor } from "@/hooks/use-editor";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

interface MenuProps {
  initialData: Doc<"blogs">;
}

const Menu = ({ initialData }: MenuProps) => {
  const router = useRouter();
  const publish = usePublish();
  const { isLocked, setIsLocked } = useEditor();
  const setPreview = useMutation(api.blogs.setPreview);
  const blog = useQuery(api.blogs.getById, {
    id: initialData._id,
  });

  const archive = useMutation(api.blogs.archive);

  const onArchive = React.useCallback(() => {
    const promise = archive({ id: initialData._id });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash",
      error: "Failed to move to trash",
    });

    router.push("/dashboard");
  }, [archive, initialData, router]);

  // takes in a boolean and returns a promise
  const onLockToggle = React.useCallback(
    (isLocked: boolean) => {
      setIsLocked(isLocked);

      const promise = setPreview({
        id: initialData._id,
        isPreview: isLocked,
      });

      toast.promise(promise, {
        loading: "Locking blog...",
        success: "Blog locked",
        error: "Failed to lock blog",
      });
    },
    [initialData._id, setPreview]
  );

  if (blog === undefined) {
    return <Menu.Skeleton />;
  }

  if (blog === null) {
    return null;
  }

  const menuContent = React.useMemo(
    () => (
      <PopoverContent
        className="p-1 w-60 flex flex-col gap-y-1 bg-background dark:bg-[#181717] drop-shadow-md rounded-xl"
        align="end"
        forceMount
      >
        <div className="flex items-center justify-between gap-x-2 w-full p-1 px-2 py-2">
          <Label className="flex items-center gap-x-2">
            {isLocked ? (
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
            checked={isLocked}
            onCheckedChange={onLockToggle}
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
          />
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
    [onArchive, isLocked, initialData, onLockToggle, publish]
  );

  return (
    <Popover>
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
