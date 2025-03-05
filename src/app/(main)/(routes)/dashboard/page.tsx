"use client";

import React from "react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useDexie } from "@/components/providers/dexie-provider";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const BlogsPage = () => {
  const router = useRouter();
  const { actions } = useDexie();
  const onCreate = () => {
    const promise = actions.blog
      .create({
        title: "New Blog",
        authorId: "1",
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
        <div className="space-y-2 md:text-left text-center pt-4">
          <div className="">
            <p className="text-base sm:text-lg font-medium text-muted-foreground">
              <span
                className={cn("font-bold logo-text-gradient", font.className)}
              >
                →
              </span>{" "}
              <span className="font-bold text-foreground">
                Create Your First Blog
              </span>{" "}
              – Begin writing and express yourself.
            </p>
          </div>
          <div>
            <p className="text-base sm:text-lg font-medium text-muted-foreground">
              <span
                className={cn("font-bold logo-text-gradient", font.className)}
              >
                →
              </span>{" "}
              <span className="font-bold text-foreground">
                Explore Templates
              </span>{" "}
              – Get inspired with pre-made formats.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center w-full gap-x-2 mt-20">
          <Button asChild size={"lg"} variant={"ghost"}>
            <Link href="/explore">Explore Blogs</Link>
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
