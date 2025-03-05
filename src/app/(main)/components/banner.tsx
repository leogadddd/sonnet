"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/modals/confirm-modal";
import { useDexie } from "@/app/components/providers/dexie-provider";
import { useLiveQuery } from "dexie-react-hooks";

interface BannerProps {
  blogId: string;
}

const Banner = ({ blogId }: BannerProps) => {
  const router = useRouter();
  const { actions, db } = useDexie();

  const currentBlog = useLiveQuery(async () => {
    return await db.blogs.where("blogId").equals(blogId).first();
  }, [blogId]);

  const onRemove = () => {
    router.push("/dashboard");
    const promise = actions.blog.delete(blogId);

    toast.promise(promise, {
      loading: "Deleting blog...",
      success: "Blog deleted",
      error: "Failed to delete blog",
    });
  };

  const onRestore = () => {
    const promise = actions.blog.restore(blogId);

    toast.promise(promise, {
      loading: "Restoring blog...",
      success: "Blog restored",
      error: "Failed to restore blog",
    });
  };

  if (currentBlog?.isArchived === 0) {
    return null;
  }

  return (
    <div className="w-full flex items-center gap-x-2 bg-rose-500 dark:bg-rose-700 text-primary p-3 py-2 text-sm">
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
