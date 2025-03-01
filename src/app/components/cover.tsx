"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import ConfirmModal from "@/components/modals/confirm-modal";
import { Skeleton } from "@/components/ui/skeleton";
interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({ url, preview }: CoverImageProps) => {
  const coverImage = useCoverImage();
  const removeCoverImage = useMutation(api.blogs.removeCoverImage);
  const params = useParams();

  const onRemove = () => {
    removeCoverImage({ id: params.blogId as Id<"blogs"> });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[25vh] group mt-11",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && <Image src={url} fill alt="Cover" className="object-cover" />}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 transition absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            className="text-muted-foreground text-xs bg-[#181717] border-none"
            variant="outline"
            size="sm"
            onClick={() => coverImage.onReplace(url)}
          >
            <Trash className="h-4 w-4 mr-2" />
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
