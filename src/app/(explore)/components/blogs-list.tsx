"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HeartIcon, MessageCircleIcon, ShareIcon } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TimeFormatter } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Blog {
  blog_id: string;
  title: string;
  description: string;
  cover_image?: string;
  author_id: string;
  published_at: number;
  read_time: number;
  likes?: number;
  comments?: number;
}

const BlogList = () => {
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const client = createClient();
    const fetchBlogs = async () => {
      const { data, error } = await client
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .eq("is_archived", false)
        .eq("deleted_at", 0)
        .eq("is_on_explore", true);
      if (error) {
        console.error(error);
      } else {
        setBlogs(data);
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!blogs.length) {
    return (
      <div className="flex flex-col gap-y-4 w-full text-center">
        No blogs found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4 w-full">
      {blogs.map((blog) => (
        <BlogCard key={blog.blog_id} blog={blog} />
      ))}
    </div>
  );
};

const BlogCard = ({ blog }: { blog: Blog }) => {
  const origin = useOrigin();
  const router = useRouter();
  const user = useQuery(api.users.getByClerkId, { clerkId: blog.author_id });

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

export default BlogList;
