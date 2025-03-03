"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { formatDate } from "@/lib/utils";
import { useQuery } from "convex/react";

import React from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, MessageCircleIcon, ShareIcon } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/spinner";
const BlogsList = () => {
  const blogs = useQuery(api.blogs.getExplore, {
    isFeatured: false,
  });

  if (blogs === undefined) {
    return (
      <div className="w-full flex justify-center items-center h-60">
        <Spinner size={"lg"} />
      </div>
    );
  }

  if (blogs === null) {
    return <div className="px-4">No blogs found</div>;
  }

  return (
    <div className="px-4 w-full max-w-xl mx-auto pt-4">
      {blogs.map((blog) => (
        <BlogsList.Card key={blog._id} blog={blog} />
      ))}
      {/* <div className="flex justify-center items-center py-4">
        <Button variant="ghost" className="px-4 md:px-6">
          Load more
        </Button>
      </div> */}
    </div>
  );
};

BlogsList.Card = function BlogCard({ blog }: { blog: Doc<"blogs"> }) {
  const origin = useOrigin();
  const router = useRouter();
  const user = useQuery(api.users.getByClerkId, {
    clerkId: blog.authorId,
  });

  const handleOpenBlog = React.useCallback(() => {
    const url = `${origin}/blog/${blog._id}`;
    router.push(url);
  }, [blog, origin, router]);

  return (
    <div className="flex items-center py-4 gap-x-4 border-b w-full max-w-xl mx-auto md:pt-6">
      <div
        role="button"
        onClick={handleOpenBlog}
        className="flex flex-col gap-y-2 w-full"
      >
        <div className="flex items-center gap-x-2">
          <Avatar className="w-5 h-5">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
              {user?.firstName?.charAt(0).toUpperCase()}
              {user?.lastName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-x-1">
            <p className="text-xs font-bold hover:underline cursor-pointer">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">posted</p>
          </div>
        </div>
        <div className="flex gap-x-2">
          <div className="flex flex-col w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              {blog.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-4 line-clamp-2">
              {blog.contentData.description}
            </p>
          </div>
          {blog.contentData.coverImage && (
            <div className="flex md:hidden flex-col items-center justify-center ">
              <div className="w-24 xs:w-32 sm:w-32 md:w-40 h-24 xs:h-32 sm:h-32 md:h-40 overflow-hidden rounded-lg">
                <>
                  <Image
                    src={blog.contentData.coverImage}
                    alt={blog.title}
                    width={150}
                    height={150}
                    className="object-cover h-full w-full"
                    onLoadingComplete={(img) => {
                      img.style.opacity = "1";
                    }}
                    style={{ opacity: 0 }}
                  />
                </>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1 w-full">
            <p className="text-xs text-muted-foreground">
              {formatDate(blog.blogMeta.publishedAt ?? 0)}
            </p>
            <span className="text-muted-foreground pb-1">•</span>
            <p className="text-xs text-muted-foreground">
              {blog.contentData.readTime ?? 0} min read
            </p>
          </div>
          <div className="flex items-center gap-x-1 w-full justify-end">
            <Button variant="ghost" className="px-2 md:px-3">
              <HeartIcon className="w-4 h-4" />
              <p className="text-xs text-muted-foreground">
                {blog.blogMeta.likes ?? 0}
              </p>
            </Button>
            <Button variant="ghost" className="px-2 md:px-3">
              <MessageCircleIcon className="w-4 h-4" />
              <p className="text-xs text-muted-foreground">
                {blog.blogMeta.comments ?? 0}
              </p>
            </Button>
            <Button variant="ghost" className="px-2 md:px-3">
              <ShareIcon className="w-4 h-4" />
              <p className="text-xs text-muted-foreground">Share</p>
            </Button>
          </div>
        </div>
      </div>
      {blog.contentData.coverImage && (
        <div className="hidden md:flex flex-col items-center justify-center ">
          <div className="w-24 xs:w-32 sm:w-32 md:w-40 h-24 xs:h-32 sm:h-32 md:h-full overflow-hidden rounded-lg">
            <>
              <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
              <Image
                src={blog.contentData.coverImage}
                alt={blog.title}
                width={150}
                height={150}
                className="object-cover h-full w-full"
                onLoadingComplete={(img) => {
                  img.style.opacity = "1";
                }}
                style={{ opacity: 0 }}
              />
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsList;
