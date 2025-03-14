"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ImageIcon, Trash } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import ConfirmModal from "@/components/modals/confirm-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useDexie } from "@/components/providers/dexie-provider";

import Blog from "@/lib/dexie/blog";

interface CoverImageProps {
  preview?: boolean;
  isViewer?: boolean;
  initialData: Blog;
}

export const Cover = ({
  preview,
  isViewer = false,
  initialData,
}: CoverImageProps) => {
  const { actions } = useDexie();
  const coverImage = useCoverImage();

  const onRemove = () => {
    actions.blog.removeCoverImage(initialData?.blog_id as string);
  };

  return (
    <div
      className={cn(
        "relative w-full h-[23vh] group mt-11",
        !initialData?.cover_image && "h-[5vh]",
        initialData?.cover_image && "bg-muted",
        preview && isViewer && "mt-0",
        initialData?.is_archived === 1 && "mt-[5.85rem]"
      )}
    >
      {!!initialData?.cover_image && (
        <Image
          src={initialData?.cover_image as string}
          fill
          alt="Cover"
          className="object-cover"
        />
      )}
      {initialData?.cover_image && !preview && (
        <div className="opacity-0 group-hover:opacity-100 transition absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            className="text-muted-foreground text-xs bg-[#181717] border-none"
            variant="outline"
            size="sm"
            onClick={() =>
              coverImage.onReplace(initialData?.cover_image as string)
            }
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change Cover
          </Button>
          <ConfirmModal onConfirm={onRemove}>
            <Button
              className="text-muted-foreground text-xs bg-[#181717] border-none"
              variant="outline"
              size="sm"
            >
              <Trash className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </ConfirmModal>
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line react/display-name
Cover.Skeleton = () => {
  return <Skeleton className="relative w-full h-[12vh] group" />;
};
