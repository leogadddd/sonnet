"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Item from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface BloglistProps {
  parentBlog?: Id<"blogs">;
  level?: number;
  data?: Doc<"blogs">[];
}

const Bloglist = React.memo(({ parentBlog, level = 0 }: BloglistProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = React.useCallback((blogId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [blogId]: !prevExpanded[blogId],
    }));
  }, []);

  const blogs = useQuery(api.blogs.getSidebar, {
    parentBlog: parentBlog,
  });

  const onRedirect = React.useCallback(
    (blogId: string) => {
      router.push(`/dashboard/${blogId}`);
    },
    [router]
  );

  if (blogs === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level == 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
        className={cn(
          "hidden text-xs font-medium text-muted-foreground/25 ml-4 py-1",
          level === 0 && "hidden",
          expanded && "last:block"
        )}
      >
        No Pages inside
      </p>
      {blogs.map((blog) => (
        <div key={blog._id}>
          <Item
            id={blog._id}
            onClick={() => onRedirect(blog._id)}
            label={blog.title}
            icon={FileIcon}
            documentIcon={blog.contentData.icon}
            active={params.blogId == blog._id}
            level={level}
            onExpand={() => onExpand(blog._id)}
            expanded={expanded[blog._id]}
          />
          {expanded[blog._id] && (
            <Bloglist parentBlog={blog._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
});

export default Bloglist;
