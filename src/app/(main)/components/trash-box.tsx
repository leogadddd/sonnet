"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useCallback, memo, act } from "react";
import { toast } from "sonner";
import { useDexie } from "@/components/providers/dexie-provider";

import Blog from "@/lib/dexie/blog";
import { useLiveQuery } from "dexie-react-hooks";

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();

  const { actions, db } = useDexie();

  const archivedBlogs = useLiveQuery(async () => {
    return await db.blogs.where("isArchived").equals(1).toArray();
  });

  const [search, setSearch] = useState("");

  const filteredBlogs = useMemo(
    () =>
      archivedBlogs?.filter((archivedBlogs) =>
        archivedBlogs.title.toLowerCase().includes(search.toLowerCase())
      ),
    [archivedBlogs, search]
  );

  const onClick = useCallback(
    (blog: Blog) => {
      router.push(`/dashboard/${blog.blogId}`);
    },
    [router]
  );

  const onRestore = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, blogId: string) => {
      event.stopPropagation();
      const promise = actions.blog.restore(blogId);

      toast.promise(promise, {
        loading: "Restoring blog...",
        success: "Blog restored!",
        error: "Failed to restore blog.",
      });
    },
    [actions.blog.restore]
  );

  const onRemove = useCallback(
    (blogId: string) => {
      const promise = actions.blog.delete(blogId);

      toast.promise(promise, {
        loading: "Deleting blog...",
        success: "Blog restored!",
        error: "Failed to remove blog.",
      });

      if (params.blogId === blogId) {
        router.push("/dashboard");
      }
    },
    [actions.blog.delete, params.blogId, router]
  );

  const onRestoreAll = useCallback(() => {
    const promise = actions.blog.restoreAll();

    toast.promise(promise, {
      loading: "Restoring all blogs...",
      success: "All blogs restored!",
      error: "Failed to restore all blogs.",
    });
  }, [actions.blog.restoreAll]);

  const onEmptyTrash = useCallback(() => {
    const promise = actions.blog.deleteAll();

    toast.promise(promise, {
      loading: "Emptying trash...",
      success: "Trash emptied!",
      error: "Failed to empty trash.",
    });
  }, [actions.blog.deleteAll]);

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
            key={blog.blogId}
            blog={blog}
            onClick={() => onClick(blog)}
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
  blog: Blog;
  onClick: (blogId: string) => void;
  onRestore: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    blogId: string
  ) => void;
  onRemove: (blogId: string) => void;
}

TrashBox.Item = memo(
  ({ blog, onClick, onRestore, onRemove }: TrashBoxItemProps) => {
    return (
      <div
        key={blog.blogId}
        className="text-sm w-full rounded-lg hover:bg-primary/5 flex items-center text-primary justify-between px-2 py-1"
      >
        <div
          role="button"
          onClick={() => onClick(blog.blogId)}
          className="flex items-center gap-x-1 w-full mr-4"
        >
          {blog.icon && (
            <div className="shrink-0 mr-2 text-[18px]">{blog.icon}</div>
          )}
          <span className="truncate">{blog.title}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <div
            onClick={(e) => onRestore(e, blog.blogId)}
            role={"button"}
            className="h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Undo className="h-4 w-4 text-muted-foreground" />
          </div>
          <ConfirmModal onConfirm={() => onRemove(blog.blogId)}>
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
