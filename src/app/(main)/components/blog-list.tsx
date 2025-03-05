"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Item from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { useDexie } from "@/components/providers/dexie-provider";
import Blog from "@/lib/dexie/blog";
import { useLiveQuery } from "dexie-react-hooks";
import { useWorkspace } from "@/components/workspace";

interface BloglistProps {
  parentBlog?: string;
  level?: number;
  pinned?: boolean;
}

const Bloglist = React.memo(
  ({ parentBlog, level = 0, pinned = false }: BloglistProps) => {
    const router = useRouter();
    const params = useParams();
    const { setEmpty } = useWorkspace();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const onExpand = React.useCallback((blogId: string) => {
      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        [blogId]: !prevExpanded[blogId],
      }));
    }, []);

    const { db } = useDexie();

    const sidebar = useLiveQuery(async () => {
      const blogs = await db.blogs
        .where(["isPinned", "isArchived", "parentBlog"])
        .equals([pinned ? 1 : 0, 0, parentBlog ?? ""])
        .reverse()
        .sortBy("createdAt");

      setEmpty(false);

      return blogs;
    }, [parentBlog, pinned]);

    const onRedirect = React.useCallback(
      (blog: Blog) => {
        router.push(`/dashboard/${blog.blogId}`);
      },
      [router]
    );

    if (sidebar === undefined) {
      return <></>;
    }

    return (
      <>
        <p
          style={{
            paddingLeft: level ? `${level * 12 + 25}px` : undefined,
          }}
          className={cn(
            "hidden text-xs font-medium text-muted-foreground/25 ml-4 py-1 truncate w-full",
            level === 0 && "hidden",
            expanded && "last:block"
          )}
        >
          No Pages inside
        </p>
        {sidebar.map((blog) => (
          <div key={blog.blogId}>
            <Item
              id={blog.blogId}
              onClick={() => onRedirect(blog)}
              label={blog.title}
              icon={FileIcon}
              documentIcon={blog.icon}
              active={params?.blogId == blog.blogId}
              level={level}
              isPinned={blog.isPinned === 1}
              onExpand={() => onExpand(blog.blogId)}
              expanded={expanded[blog.blogId]}
            />
            {expanded[blog.blogId] && (
              <Bloglist parentBlog={blog.blogId} level={level + 1} />
            )}
          </div>
        ))}
      </>
    );
  }
);

export default Bloglist;
