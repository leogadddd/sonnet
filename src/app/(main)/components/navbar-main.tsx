"use client";

import React, { useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { ChevronLeft, MenuIcon } from "lucide-react";
import { Title } from "@/components/title";
import Banner from "@/components/banner";
import Menu from "@/components/menu";
import { Publish } from "@/components/publish";

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
    const params = useParams();
    const blog = useQuery(api.blogs.getById, {
      id: params.blogId as Id<"blogs">,
    });

    // Memoize the click handlers
    const handleCollapse = useCallback(() => {
      collapse();
    }, [collapse]);

    const handleResetWidth = useCallback(() => {
      onResetWidth();
    }, [onResetWidth]);

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
            <div className="flex items-center gap-x-2">
              {!isCollapsed && (
                <ChevronLeft
                  onClick={handleCollapse}
                  role="button"
                  className="h-6 w-6 mb-1 text-muted-foreground"
                />
              )}
              {isCollapsed && (
                <MenuIcon
                  role="button"
                  onClick={handleResetWidth}
                  className="h-6 w-6 text-muted-foreground"
                />
              )}
              <Title initialData={blog} />
            </div>
            <div className="flex items-center gap-x-2">
              <Menu initialData={blog._id} />
            </div>
          </div>
        </nav>
        {blog.blogMeta.isArchived && <Banner blogId={blog._id} />}
      </>
    );
  }
);
Navbar.displayName = "Navbar";
