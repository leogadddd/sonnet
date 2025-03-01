"use client";

import React from "react";
import { Id } from "@/convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Globe, MoreHorizontal, Share, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublish } from "@/hooks/use-publish";
interface MenuProps {
  initialData: Id<"blogs">;
}

const Menu = ({ initialData }: MenuProps) => {
  const router = useRouter();
  const publish = usePublish();
  const blog = useQuery(api.blogs.getById, {
    id: initialData,
  });

  const archive = useMutation(api.blogs.archive);

  const onArchive = React.useCallback(() => {
    const promise = archive({ id: initialData });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash",
      error: "Failed to move to trash",
    });

    router.push("/dashboard");
  }, [archive, initialData, router]);

  if (blog === undefined) {
    return <Menu.Skeleton />;
  }

  if (blog === null) {
    return null;
  }

  const menuContent = React.useMemo(
    () => (
      <DropdownMenuContent
        className="p-1 w-60 flex flex-col gap-y-1 bg-background dark:bg-[#181717] drop-shadow-md rounded-xl"
        align="end"
        forceMount
      >
        <DropdownMenuItem
          className="cursor-pointer rounded-lg "
          onClick={publish.onOpen}
        >
          <Share className="h-4 w-4 mr-2 " />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onArchive}
          className="cursor-pointer rounded-lg text-red-500 focus:text-red-400 pr-4"
        >
          <Trash className="h-4 w-4 mr-2 " />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    ),
    [onArchive]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"sm"}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      {menuContent}
    </DropdownMenu>
  );
};

// eslint-disable-next-line react/display-name
Menu.Skeleton = () => {
  return <Skeleton className="h-8 w-8" />;
};

export default Menu;
