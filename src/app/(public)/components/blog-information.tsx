"use client";

import { Avatar, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { api } from "@/convex/_generated/api";
import Blog from "@/lib/dexie/blog";
import { TimeFormatter } from "@/lib/utils";
import { useQuery } from "convex/react";
import React from "react";

interface BlogInformationProps {
  initialData: Blog;
}

const BlogInformation = ({ initialData }: BlogInformationProps) => {
  const author = useQuery(api.users.getByClerkId, {
    clerkId: initialData.author_id,
  });

  return (
    <div className="px-14 pb-4 flex flex-col gap-y-3">
      <div className="flex items-center gap-x-2 text-sm">
        <div className="max-w-[150px]">
          <Avatar className="h-8 w-8">
            <AvatarImage src={author?.imageUrl} className="object-cover" />
          </Avatar>
        </div>
        <div>
          <div className="flex gap-x-2">
            <p className="text-sm">
              <span className="text-start font-bold w-full truncate">
                {author?.firstName} {author?.lastName}
              </span>
            </p>
            {process.env.NODE_ENV === "development" && (
              <Badge
                variant={"outline"}
                className="px-2 text-muted-foreground py-0 text-xs"
              >
                dev
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground/50 text-xs">
            {TimeFormatter.timeAgo(initialData.published_at)} •{" "}
            {initialData.read_time} min read
          </p>
        </div>
      </div>
      <div className="h-[1px] bg-muted-foreground/10 w-full" />
    </div>
  );
};

export default BlogInformation;
