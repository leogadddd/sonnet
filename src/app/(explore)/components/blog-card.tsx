"use client";

import { api } from "@/convex/_generated/api";
import { useOrigin } from "@/hooks/use-origin";
import Blog from "@/lib/dexie/blog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TimeFormatter } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import { HeartIcon, MessageCircleIcon, ShareIcon } from "lucide-react";

const BlogCard = ({ blog }: { blog: Blog }) => {
  const origin = useOrigin();
  const router = useRouter();
  const author = useQuery(api.users.getByClerkId, {
    clerkId: blog.author_id,
  });

  const handleOpenBlog = () => {
    router.push(`${origin}/blog/${blog.blog_id}`);
  };

  return (
    <div className="flex items-center py-4 gap-x-4 border-b w-full max-w-xl mx-auto md:pt-6">
      <div
        role="button"
        onClick={handleOpenBlog}
        className="flex flex-col gap-y-2 w-full"
      >
        <div className="flex items-center gap-x-2">
          <Avatar className="w-5 h-5">
            <AvatarImage src={author?.imageUrl} />
            <AvatarFallback>
              {author?.firstName?.charAt(0).toUpperCase()}
              {author?.lastName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-x-1">
            {author ? (
              <>
                <p className="text-xs font-bold hover:underline cursor-pointer">
                  <>
                    {author?.firstName} {author?.lastName}
                  </>
                </p>
                <p className="text-xs text-muted-foreground">posted</p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                Posted by Someone from{" "}
                {process.env.NODE_ENV === "development"
                  ? "Development"
                  : "Production"}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-x-2">
          <div className="flex flex-col w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              {blog.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-4 line-clamp-2">
              {blog.description}
            </p>
          </div>
          {blog.cover_image && (
            <div className="flex md:hidden flex-col items-center justify-center">
              <div className="w-24 xs:w-32 sm:w-32 md:w-40 h-24 xs:h-32 sm:h-32 md:h-40 overflow-hidden rounded-lg">
                <Image
                  src={blog.cover_image}
                  alt={blog.title}
                  width={150}
                  height={150}
                  className="object-cover h-full w-full"
                  style={{ opacity: 0 }}
                  onLoadingComplete={(img) => (img.style.opacity = "1")}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1 w-full">
            <p className="text-xs text-muted-foreground">
              {TimeFormatter.timeAgo(blog.published_at)}
            </p>
            <span className="text-muted-foreground pb-1">•</span>
            <p className="text-xs text-muted-foreground">
              {blog.read_time} min read
            </p>
          </div>
          <div className="flex items-center gap-x-1 w-full justify-end">
            <Button variant="ghost" className="px-2 md:px-3">
              <HeartIcon className="w-4 h-4" />
              <p className="text-xs text-muted-foreground">{blog.likes ?? 0}</p>
            </Button>
            <Button variant="ghost" className="px-2 md:px-3">
              <MessageCircleIcon className="w-4 h-4" />
              <p className="text-xs text-muted-foreground">
                {blog.comments ?? 0}
              </p>
            </Button>
            <Button variant="ghost" className="px-2 md:px-3">
              <ShareIcon className="w-4 h-4" />
              <p className="text-xs text-muted-foreground">Share</p>
            </Button>
          </div>
        </div>
      </div>

      {blog.cover_image && (
        <div className="hidden md:flex flex-col items-center justify-center">
          <div className="w-24 xs:w-32 sm:w-32 md:w-40 h-24 xs:h-32 sm:h-32 md:h-full overflow-hidden rounded-lg">
            <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
            <Image
              src={blog.cover_image}
              alt={blog.title}
              width={150}
              height={150}
              className="object-cover h-full w-full"
              style={{ opacity: 0 }}
              onLoadingComplete={(img) => (img.style.opacity = "1")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCard;
