"use client";

import React, { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import dynamic from "next/dynamic";
import { useDexie } from "@/components/providers/dexie-provider";
import { useLiveQuery } from "dexie-react-hooks";

const BlogsPageViewer = () => {
  const params = useParams();
  const { blogId } = params;
  const blog = useLiveQuery(async () => {
    return await db.blogs
      .where("blogId")
      .equals(blogId as string)
      .first();
  }, [blogId]);

  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor-v2"), { ssr: false }),
    []
  );

  const { db } = useDexie();

  const onChange = useMemo(() => {
    return (value: string) => {};
  }, [blog]);

  if (blog === undefined) {
    return <div></div>;
  }

  if (blog === null || blog === undefined) {
    return <div>Not found</div>;
  }

  return (
    <div className="">
      <Cover preview={true} />
      <div className="mx-auto max-w-md lg:max-w-6xl md:max-w-4xl md:px-24">
        <Toolbar initialData={blog} preview={true} />
        <Editor
          editable={false}
          onChange={onChange}
          initialContent={blog?.content ?? ""}
        />
      </div>
    </div>
  );
};

export default BlogsPageViewer;
