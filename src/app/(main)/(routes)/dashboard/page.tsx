"use client";

import React from "react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Globe, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useDexie } from "@/components/providers/dexie-provider";
import useUser from "@/hooks/use-user";
const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const BlogsPage = () => {
  const router = useRouter();
  const { actions } = useDexie();
  const { user } = useUser();
  const onCreate = () => {
    const promise = actions.blog
      .create({
        title: "New Blog",
        authorId: user?.clerkId || "",
      })
      .then((blogId) => {
        router.push(`/dashboard/${blogId}`);
      });

    toast.promise(promise, {
      loading: "Creating a new blog...",
      success: "New blog created!",
      error: "Failed to create a new blog.",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="px-[54px]">
        <h2 className="pb-[11.5px] text-5xl font-bold break-words text-center min-w-fit">
          Welcome to{" "}
          <span className={cn("font-bold max-w-fit", font.className)}>
            <span className="logo-text-gradient">Sonnet </span>
            <span className="text-muted-foreground">!</span>
          </span>
        </h2>
        <p className="text-center font-medium text-muted-foreground">
          Craft your thoughts, share your ideas, and make your words count.
        </p>
        <div className="flex flex-col items-center gap-y-4 pt-4 max-w-[500px] mx-auto">
          <div className="flex flex-col items-center">
            <span className="font-bold text-foreground logo-text-gradient text-xl">
              Create Your First Blog
            </span>
            <p className="text-base sm:text-md font-medium text-muted-foreground">
              Begin writing and express yourself.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-bold text-foreground logo-text-gradient text-xl">
              Discover Blogs
            </span>
            <p className="text-base sm:text-md font-medium text-muted-foreground">
              Discover and get inspired by other blogs.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center w-full gap-x-2 mt-20">
          <Button asChild size={"lg"} variant={"ghost"} className="rounded-lg">
            <Link href="/explore">
              <Globe className="w-4 h-4 mr-2" />
              Explore Blogs
            </Link>
          </Button>
          <Button size={"lg"} onClick={onCreate} className="rounded-lg">
            <Plus className="w-4 h-4 mr-2" />
            New Blog
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
