"use client";

import React, { useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const DocumentIdPage = () => {
  const params = useParams();

  const update = useMutation(api.blogs.update);

  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const onChange = useMemo(() => {
    return (value: string) => {
      update({
        id: params.blogId as Id<"blogs">,
        content: value,
      });
    };
  }, [update, params.blogId]);

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

  if (document === null) {
    return <div>Not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={blog.contentData.coverImage} />
      <div className="mx-auto w-full max-w-4xl flex-1 lg:min-w-max">
        <Toolbar initialData={blog} />
        <Editor onChange={onChange} initialContent={blog.contentData.content} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
