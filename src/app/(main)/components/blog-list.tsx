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
        .where(["is_pinned", "is_archived", "parent_blog"])
        .equals([pinned ? 1 : 0, 0, parentBlog ?? ""])
        .reverse()
        .sortBy("created_at");

      setEmpty(false);

      return blogs;
    }, [parentBlog, pinned]);

    const onRedirect = React.useCallback(
      (blog: Blog) => {
        router.push(`/dashboard/${blog.blog_id}`);
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
          <div key={blog.blog_id}>
            <Item
              id={blog.blog_id}
              onClick={() => onRedirect(blog)}
              label={blog.title}
              icon={FileIcon}
              documentIcon={blog.icon}
              active={params?.blogId == blog.blog_id}
              level={level}
              isPinned={blog.is_pinned === 1}
              onExpand={() => onExpand(blog.blog_id)}
              expanded={expanded[blog.blog_id]}
            />
            {expanded[blog.blog_id] && (
              <Bloglist parentBlog={blog.blog_id} level={level + 1} />
            )}
          </div>
        ))}
      </>
    );
  }
);

export default Bloglist;
