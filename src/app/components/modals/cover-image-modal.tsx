"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useDexie } from "@/components/providers/dexie-provider";

export const CoverImageModal = () => {
  const params = useParams();
  const update = useMutation(api.blogs.update);
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();
  const { actions } = useDexie();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url,
        },
      });

      await actions.blog.update(params.blogId as string, {
        cover_image: res.url,
      });

      onClose();
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent className="bg-background dark:bg-[#181717] drop-shadow-lg rounded-lg">
        <DialogHeader className="border-b pb-3">
          <DialogTitle>Cover Image</DialogTitle>
          <DialogDescription>Add a cover image to your blog.</DialogDescription>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full "
          value={file}
          onChange={onChange}
          disabled={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
