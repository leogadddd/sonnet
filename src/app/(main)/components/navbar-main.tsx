"use client";

import React, { useCallback } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, MenuIcon, Lock, Globe, Telescope } from "lucide-react";
import { Title } from "@/components/title";
import Banner from "@/components/banner";
import Menu from "@/components/menu";
import { Badge } from "@/app/components/ui/badge";
import { toast } from "sonner";
import { usePublish } from "@/hooks/use-publish";
import { useDexie } from "@/app/components/providers/dexie-provider";
import { useLiveQuery } from "dexie-react-hooks";
import { useEditor } from "@/hooks/use-editor";

interface NavbarProps {
  isCollapsed: boolean;
  collapse: () => void;
  onResetWidth: () => void;
}

// Memoize the skeleton component
const NavbarSkeleton = React.memo(() => (
  <nav className="bg-background dark:bg-[#181717] px-3 py-2 w-full flex items-center justify-between">
    <Title.Skeleton />
    <div className="flex items-center gap-x-2">
      <Menu.Skeleton />
    </div>
  </nav>
));
NavbarSkeleton.displayName = "NavbarSkeleton";

export const Navbar = React.memo(
  ({ isCollapsed, collapse, onResetWidth }: NavbarProps) => {
    const { saveStatus, characterCount } = useEditor();
    const params = useParams();
    const blogId = params.blogId as string;

    const { actions, db } = useDexie();

    const blog = useLiveQuery(async () => {
      return await db.blogs.where("blog_id").equals(blogId).first();
    }, [blogId]);

    const publish = usePublish();

    // Memoize the click handlers
    const handleCollapse = useCallback(() => {
      collapse();
    }, [collapse]);

    const handleResetWidth = useCallback(() => {
      onResetWidth();
    }, [onResetWidth]);

    const handleUnlock = useCallback(async () => {
      if (!blog) return;

      const promise = actions.blog.setPreview(blog.blog_id, false);

      toast.promise(promise, {
        loading: "Unlocking blog...",
        success: "Blog unlocked",
        error: "Failed to unlock blog",
      });
    }, [blog]);

    if (blog === undefined) {
      return <NavbarSkeleton />;
    }

    if (blog === null) {
      return null;
    }

    return (
      <>
        <nav className="bg-background dark:bg-[#181717] px-3 py-1 w-full flex items-center gap-x-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-x-2 min-w-0">
              {!isCollapsed && (
                <ChevronLeft
                  onClick={handleCollapse}
                  role="button"
                  className="h-6 w-6 mb-1 text-muted-foreground flex-shrink-0"
                />
              )}
              {isCollapsed && (
                <MenuIcon
                  role="button"
                  onClick={handleResetWidth}
                  className="h-6 w-6 text-muted-foreground flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1 pr-1">
                <Title initialData={blog} />
              </div>
              <div className="flex items-center gap-x-2 flex-shrink-0 px-2">
                {blog.is_preview === 1 && (
                  <Badge
                    role="button"
                    onClick={handleUnlock}
                    variant={"outline"}
                    className="text-xs text-muted-foreground group/lock-badge hover:text-primary hover:border-primary/25"
                  >
                    <div className="flex items-center">
                      <Lock className="h-3 w-3 md:mr-2 hidden md:block" />
                      <Lock className="h-4 w-3 md:hidden" />
                      <span className="hidden md:block">Locked</span>
                    </div>
                  </Badge>
                )}
                {blog.is_published === 1 && (
                  <Badge
                    role="button"
                    variant={"outline"}
                    onClick={() => publish.onOpen()}
                    className="text-xs text-muted-foreground group/lock-badge hover:text-sky-800 hover:border-blue-400/25"
                  >
                    <div className="flex items-center border-sky-800 text-blue-400 ">
                      <Globe className="h-3 w-3 md:mr-2 hidden md:block" />
                      <Globe className="h-4 w-3 md:hidden" />
                      <span className="hidden md:block">Published</span>
                    </div>
                  </Badge>
                )}
                {blog.is_on_explore === 1 && (
                  <Badge
                    role="button"
                    variant={"outline"}
                    onClick={() => publish.onOpen()}
                    className="text-xs text-muted-foreground group/lock-badge  hover:hover:border-[#ff914d]/25 "
                  >
                    <div className="flex items-center ">
                      <Telescope className="h-3 w-3 md:mr-2 hidden md:block text-[#ff3131]" />
                      <Telescope className="h-4 w-3 md:hidden text-[#ff3131]" />
                      <span className="hidden md:block logo-text-gradient ">
                        Explore
                      </span>
                    </div>
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <div>
                {/* {saveStatus === "unsaved" && (
                  <Badge
                    variant={"outline"}
                    className="text-xs text-muted-foreground group/lock-badge hover:text-primary hover:border-primary/25"
                  >
                    Unsaved
                  </Badge>
                )}
                {saveStatus === "saved" && (
                  <Badge
                    variant={"outline"}
                    className="text-xs text-muted-foreground group/lock-badge hover:text-primary hover:border-primary/25"
                  >
                    Saved
                  </Badge>
                )} */}
              </div>
              <Menu initialData={blog} />
            </div>
          </div>
        </nav>
        {blog.is_archived === 1 && <Banner blogId={blog.blog_id} />}
      </>
    );
  }
);
Navbar.displayName = "Navbar";
