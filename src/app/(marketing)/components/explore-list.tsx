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
import { Button } from "@/components/ui/button";
import {
  BookmarkIcon,
  HeartIcon,
  MessageCircleIcon,
  ShareIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

const ExploreItem = React.memo(
  ({ blog }: { blog: Doc<"blogs"> }) => {
    return (
      <div className="max-w-xl mx-auto hover:shadow-lg dark:bg-secondary/15 bg-secondary/20 p-4 border rounded-xl transition-all duration-300">
        <Link href={`/blog/${blog._id}`} className="block">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-x-2 w-full text-left">
              {blog.contentData.icon && <p className="text-4xl">{blog.contentData.icon}</p>}
              <h2
                className={cn(
                  "text-lg md:text-2xl font-bold w-full",
                  !!!blog.contentData.icon && "text-2xl"
                )}
              >
                {blog.title}
              </h2>
            </div>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <BookmarkIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mt-2 mb-4">
            <p>John Doe • Oct 8, 2023</p>
            <p>4 mins read</p>
          </div>
          <p className="text-left font-light leading-relaxed mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis,
            eum nihil inventore labore nulla sunt praesentium asperiores.
          </p>
          {blog.contentData.coverImage && (
            <div className="mt-4 w-full border rounded-lg overflow-hidden">
              <Image
                src={blog.contentData.coverImage}
                alt={blog.title}
                width={0}
                height={400}
                sizes="100vw"
                className="w-full rounded-lg object-cover h-[200px] lg:h-[400px]"
              />
            </div>
          )}
          <div className="flex items-center justify-end w-full mt-2 gap-x-2">
            {[
              { icon: ShareIcon, count: 8, label: "Shares" },
              { icon: HeartIcon, count: 8, label: "Likes" },
              { icon: MessageCircleIcon, count: 2023, label: "Comments" },
            ].map(({ icon: Icon, count, label }, index) => (
              <Button key={index} variant="ghost" size="sm">
                <Icon className="w-4 h-4" />
                <p className="text-sm text-muted-foreground">{count}</p>
                <p className="text-sm text-muted-foreground hidden md:block">
                  {label}
                </p>
              </Button>
            ))}
          </div>
        </Link>
      </div>
    );
  }
);

export default ExploreList;
