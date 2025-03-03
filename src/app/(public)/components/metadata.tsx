"use client";

import React from "react";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDate } from "@/lib/utils";

const MetadataBar = ({ blog }: { blog: Doc<"blogs"> }) => {
  const user = useQuery(api.users.getByClerkId, {
    clerkId: blog.authorId,
  });

  return (
    <div className="px-[54px] flex items-center justify-between pb-4">
      <div className="flex items-center gap-x-2">
        <Avatar className="w-9 h-9">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>
            {user?.firstName?.charAt(0).toUpperCase()}
            {user?.lastName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-bold">
            {user?.firstName} {user?.lastName}
          </p>
          <div className="flex items-center gap-x-2">
            <p className="text-sm text-muted-foreground">
              posted {formatDate(blog.blogMeta.publishedAt ?? 0)}
            </p>
            <span className="text-muted-foreground">•</span>
            <p className="text-sm text-muted-foreground">
              {blog.contentData.readTime ?? 0} min read
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetadataBar;
