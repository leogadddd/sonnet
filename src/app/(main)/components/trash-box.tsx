"use client";

import ConfirmModal from "@/app/components/modals/confirm-modal";
import { Spinner } from "@/app/components/spinner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useCallback, memo } from "react";
import { toast } from "sonner";

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const archivedBlogs = useQuery(api.blogs.getTrash);
  const restore = useMutation(api.blogs.restore);
  const restoreAll = useMutation(api.blogs.restoreAll);
  const remove = useMutation(api.blogs.remove);
  const removeAll = useMutation(api.blogs.removeAll);

  const [search, setSearch] = useState("");

  const filteredBlogs = useMemo(
    () =>
      archivedBlogs?.filter((archivedBlogs) =>
        archivedBlogs.title.toLowerCase().includes(search.toLowerCase())
      ),
    [archivedBlogs, search]
  );

  const onClick = useCallback(
    (blogId: string) => {
      router.push(`/dashboard/${blogId}`);
    },
    [router]
  );

  const onRestore = useCallback(
    (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      blogId: Id<"blogs">
    ) => {
      event.stopPropagation();
      const promise = restore({ id: blogId });

      toast.promise(promise, {
        loading: "Restoring blog...",
        success: "Blog restored!",
        error: "Failed to restore blog.",
      });
    },
    [restore]
  );

  const onRemove = useCallback(
    (blogId: Id<"blogs">) => {
      const promise = remove({ id: blogId });

      toast.promise(promise, {
        loading: "Deleting blog...",
        success: "Blog restored!",
        error: "Failed to remove blog.",
      });

      if (params.blogId === blogId) {
        router.push("/dashboard");
      }
    },
    [remove, params.blogId, router]
  );

  const onRestoreAll = useCallback(() => {
    const promise = restoreAll();

    toast.promise(promise, {
      loading: "Restoring all blogs...",
      success: "All blogs restored!",
      error: "Failed to restore all blogs.",
    });
  }, [restoreAll]);

  const onEmptyTrash = useCallback(() => {
    const promise = removeAll();

    toast.promise(promise, {
      loading: "Emptying trash...",
      success: "Trash emptied!",
      error: "Failed to empty trash.",
    });
  }, [removeAll]);

  if (archivedBlogs === undefined) {
    return (
      <div className="h-full flex-items-center justify-center p-[.85rem] w-full">
        <Spinner size={"lg"} className="text-muted-foreground mx-auto" />
      </div>
    );
  }

  if (archivedBlogs?.length === 0) {
    return (
      <div className="h-full flex-items-center justify-center p-4 w-full">
        <p className="text-sm text-muted-foreground text-center">
          No blogs in trash
        </p>
      </div>
    );
  }

  return (
    <div className="text-sm p-2">
      <div className="flex items-center gap-x-1 p-1 px-2 border rounded-lg">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 px-2 border-none focus-visible:ring-transparent"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground">
          No documents found.
        </p>
        {filteredBlogs?.map((blog) => (
          <TrashBox.Item
            key={blog._id}
            blog={blog}
            onClick={onClick}
            onRestore={onRestore}
            onRemove={onRemove}
          />
        ))}
      </div>
      {/* two buttons at the bottom of the page */}
      <div className="flex items-center justify-end gap-x-2 mt-2">
        <Button variant={"ghost"} size="sm" onClick={onRestoreAll}>
          Restore All
        </Button>
        <Button
          variant={"ghost"}
          size="sm"
          className="text-red-500 hover:text-red-500"
          onClick={onEmptyTrash}
        >
          Empty Trash
        </Button>
      </div>
    </div>
  );
};

interface TrashBoxItemProps {
  blog: Doc<"blogs">;
  onClick: (blogId: string) => void;
  onRestore: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    blogId: Id<"blogs">
  ) => void;
  onRemove: (blogId: Id<"blogs">) => void;
}

TrashBox.Item = memo(
  ({ blog, onClick, onRestore, onRemove }: TrashBoxItemProps) => {
    return (
      <div
        key={blog._id}
        className="text-sm w-full rounded-lg hover:bg-primary/5 flex items-center text-primary justify-between px-2 py-1"
      >
        <div
          role="button"
          onClick={() => onClick(blog._id)}
          className="flex items-center gap-x-1 w-full mr-4"
        >
          {blog.contentData.icon && (
            <div className="shrink-0 mr-2 text-[18px]">{blog.contentData.icon}</div>
          )}
          <span className="truncate">{blog.title}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <div
            onClick={(e) => onRestore(e, blog._id)}
            role={"button"}
            className="h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Undo className="h-4 w-4 text-muted-foreground" />
          </div>
          <ConfirmModal onConfirm={() => onRemove(blog._id)}>
            <div
              role={"button"}
              className="h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
            >
              <Trash className="h-4 w-4 text-muted-foreground" />
            </div>
          </ConfirmModal>
        </div>
      </div>
    );
  }
);
