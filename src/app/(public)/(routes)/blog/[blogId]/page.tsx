"use client";

import React, { useEffect, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import Breadcrumbs from "@/components/breadcrumbs";
import MetadataBar from "@/app/(public)/components/metadata";

const BlogsPageEditor = () => {
  const params = useParams();
  const [isEditorLoaded, setIsEditorLoaded] = React.useState(false);

  const Editor = useMemo(
    () =>
      dynamic(() => import("@/components/editor"), {
        ssr: false,
        loading: () => <div className="w-full h-40" />,
      }),
    []
  );

  useEffect(() => {
    setIsEditorLoaded(true);
  }, []);

  const onChange = useMemo(() => {
    return (value: string) => {
      // do nothing
    };
  }, [params.blogId]);

  const blog = useQuery(api.blogs.getById, {
    id: params.blogId as Id<"blogs">,
  });

  if (blog === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="mx-auto md:mx-0 md:pl-24 min-w-fit mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[75%]" />
            <Skeleton className="h-4 w-[75%]" />
            <Skeleton className="h-4 w-[20%]" />
          </div>
        </div>
      </div>
    );
  }

  if (blog === null) {
    return <div>Not found</div>;
  }

  return (
    <div className="">
      <Cover preview={true} url={blog.contentData.coverImage} />
      <Breadcrumbs blog={blog} />
      <div className="mx-auto max-w-md lg:max-w-6xl md:max-w-4xl md:px-24">
        <Toolbar preview={true} initialData={blog} />
        <MetadataBar blog={blog} />
        <div className="px-[54px]">
          <div className="w-full border-t pb-12"></div>
        </div>
        {isEditorLoaded && (
          <Editor
            editable={false}
            onChange={onChange}
            initialContent={blog.contentData.content}
          />
        )}
      </div>
    </div>
  );
};

export default BlogsPageEditor;
