"use client";

import { Id } from "@/convex/_generated/dataModel";
import React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/modals/confirm-modal";

interface BannerProps {
  documentId: Id<"documents">;
}

const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();
  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const onRemove = () => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: "Deleting blog...",
      success: "Blog deleted",
      error: "Failed to delete blog",
    });

    router.push("/documents");
  };

  const onRestore = () => {
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring blog...",
      success: "Blog restored",
      error: "Failed to restore blog",
    });
  };

  return (
    <div className="flex items-center gap-x-2 bg-rose-500 dark:bg-rose-700 text-primary p-3 py-2 text-sm">
      <p className="truncate font-medium text-base text-white">
        This blog is in the trash
      </p>
      <div className="ml-auto flex items-center gap-x-2">
        <Button
          size="sm"
          variant="outline"
          className="border-0 bg-transparent hover:bg-primary/5 text-white hover:text-white p-2 px-2 h-auto font-normal"
          onClick={onRestore}
        >
          Restore Blog
        </Button>
        <ConfirmModal onConfirm={onRemove}>
          <Button
            size="sm"
            variant="outline"
            className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-2 px-2 h-auto font-normal"
          >
            Delete Blog
          </Button>
        </ConfirmModal>
      </div>
    </div>
  );
};

export default Banner;
