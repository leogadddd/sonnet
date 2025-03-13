"use client";

import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
  UIEventHandler,
} from "react";
import Image from "next/image";
import { VariableSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/spinner";
import { Doc } from "@/convex/_generated/dataModel";
const ExploreList = () => {
  const blogs = useQuery(api.blogs.getExplore);

  const memoizedBlogs = useMemo(() => blogs || [], [blogs]);
  if (blogs === undefined) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  if (blogs === null) {
    return null;
  }

  return (
    <div className="relative mx-auto w-full overflow-hidden flex flex-col gap-y-2 px-4 pb-6">
      {memoizedBlogs.map((blog) => (
        <ExploreItem key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

const ExploreItem = React.memo(({ blog }: { blog: Doc<"blogs"> }) => {
  const user = useQuery(api.users., {
    clerkId: blog.authorId,
  });

  return (
    <div className="">
      <p>{blog.title}</p>
    </div>
  );
});

export default ExploreList;
