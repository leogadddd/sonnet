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

import { useLiveQuery } from "dexie-react-hooks";

interface CoverImageProps {
  preview?: boolean;
}

export const Cover = ({ preview }: CoverImageProps) => {
  const { actions, db } = useDexie();
  const params = useParams();
  const blogId = params.blogId as string;
  const blog = useLiveQuery(async () => {
    return await db.blogs.where("blog_id").equals(blogId).first();
  }, [blogId]);
  const coverImage = useCoverImage();

  const onRemove = () => {
    actions.blog.removeCoverImage(blog?.blog_id as string);
  };

  return (
    <div
      className={cn(
        "relative w-full h-[23vh] group mt-11",
        !blog?.cover_image && "h-[5vh]",
        blog?.cover_image && "bg-muted",
        preview && "mt-0",
        blog?.is_archived === 1 && "mt-[5.85rem]"
      )}
    >
      {!!blog?.cover_image && (
        <Image
          src={blog?.cover_image as string}
          fill
          alt="Cover"
          className="object-cover"
        />
      )}
      {blog?.cover_image && !preview && (
        <div className="opacity-0 group-hover:opacity-100 transition absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            className="text-muted-foreground text-xs bg-[#181717] border-none"
            variant="outline"
            size="sm"
            onClick={() => coverImage.onReplace(blog?.cover_image as string)}
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
