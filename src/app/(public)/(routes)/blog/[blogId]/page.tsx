"use client";

import React, { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import dynamic from "next/dynamic";

import Blog from "@/lib/dexie/blog";
import { createClient } from "@/lib/supabase/client";

const BlogsPageViewer = () => {
  const [blog, setBlog] = React.useState<Blog | null | undefined>(undefined);
  const params = useParams();
  const { blogId } = params;

  useEffect(() => {
    if (!blogId) {
      return;
    }

    const fetchBlogs = async () => {
      const client = createClient();
      const { data, error } = await client
        .from("blogs")
        .select("*")
        .eq("blog_id", blogId)
        .eq("is_published", true)
        .eq("is_archived", false)
        .eq("deleted_at", 0)
        .eq("is_on_explore", true);

      if (error) {
        console.error(error);
        return;
      } else {
        setBlog(data[0]);
      }
    };

    fetchBlogs();
  }, [blogId]);

  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor-v2"), { ssr: false }),
    []
  );

  if (blog === undefined) {
    <div>Loading...</div>;
  }

  if (blog === null) {
    <div>Not Found</div>;
  }

  return (
    <div className="">
      {blog && <Cover preview={true} initialData={blog} />}
      <div className="mx-auto max-w-md lg:max-w-6xl md:max-w-4xl md:px-24">
        {blog && <Toolbar initialData={blog} preview={true} />}
        <Editor
          editable={false}
          onChange={() => {}}
          initialContent={blog?.content ?? ""}
        />
      </div>
    </div>
  );
};

export default BlogsPageViewer;
