"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const BlogsPage = () => {
  const create = useMutation(api.blogs.create);
  const router = useRouter();

  const onCreate = () => {
    const promise = create({
      title: "New Blog",
    }).then((blogId) => {
      router.push(`/dashboard/${blogId}`);
    });

    toast.promise(promise, {
      loading: "Creating a new blog...",
      success: "New blog created!",
      error: "Failed to create a new blog.",
    });
  };

  return (
    <div className="pt-[14.6rem] px-12">
      <div className="mx-auto w-full max-w-3xl flex-1 lg:min-w-max">
        <h2 className="pb-[11.5px] text-5xl font-bold break-words text-center md:text-left min-w-fit">
          Welcome to{" "}
          <span className={cn("font-bold max-w-fit", font.className)}>
            <span className="logo-text-gradient">Sonnet </span>
            <span className="text-muted-foreground">!</span>
          </span>
        </h2>
        <p className="text-center md:text-left font-medium text-muted-foreground">
          Craft your thoughts, share your ideas, and make your words count.
        </p>
        <div className="space-y-2 md:text-left text-center pt-4">
          <div className="">
            <p className="text-base sm:text-lg font-medium">
              <span
                className={cn("font-bold logo-text-gradient", font.className)}
              >
                →
              </span>{" "}
              <span className="font-bold">Create Your First Blog</span> – Begin
              writing and express yourself.
            </p>
          </div>
          <div>
            <p className="text-base sm:text-lg font-medium">
              <span
                className={cn("font-bold logo-text-gradient", font.className)}
              >
                →
              </span>{" "}
              <span className="font-bold">Explore Templates</span> – Get
              inspired with pre-made formats.
            </p>
          </div>
        </div>
        <div className="flex items-center md:justify-start justify-center w-full gap-x-2 mt-24">
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
