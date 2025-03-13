"use client";

import { usePublish } from "@/hooks/use-publish";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, CircleCheck, Copy, Globe, Link } from "lucide-react";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useOrigin } from "@/hooks/use-origin";
import { useDexie } from "@/components/providers/dexie-provider";
import { useLiveQuery } from "dexie-react-hooks";

export const PublishModal = () => {
  const params = useParams();
  const blogId = params.blogId as string;

  const { actions, db } = useDexie();
  const blog = useLiveQuery(async () => {
    if (!blogId) {
      return null;
    }

    return await db.blogs.where("blog_id").equals(blogId).first();
  }, [blogId]);

  const origin = useOrigin();

  const publishContext = usePublish();

  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const showOnExpore = React.useCallback(
    async (checked: boolean) => {
      try {
        setIsLoading(true);
        actions.blog.update(blogId, {
          is_on_explore: checked ? 1 : 0,
        });
      } catch (error) {
        toast.error("Failed to update blog");
      } finally {
        setIsLoading(false);
      }
    },
    [blogId, actions.blog]
  );

  const publishBlog = React.useCallback(async () => {
    try {
      setIsLoading(true);
      actions.blog.publish(blogId);
      toast.success("Blog published");
    } catch (error) {
      toast.error("Failed to publish blog");
    } finally {
      setIsLoading(false);
    }
  }, [blogId, actions.blog]);

  const unpublishBlog = React.useCallback(async () => {
    try {
      setIsLoading(true);
      actions.blog.unpublish(blogId);
      toast.success("Blog unpublished");
    } catch (error) {
      toast.error("Failed to unpublish blog");
    } finally {
      setIsLoading(false);
    }
  }, [blogId, actions.blog]);

  const handleCopy = React.useCallback(() => {
    setIsCopied(true);
    const url = `${origin}/blog/${blogId}`;
    // if mobile, use the share button
    if (navigator.share) {
      navigator.share({
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }, [blogId, origin]);

  const handleOpenInNewTab = React.useCallback(() => {
    const url = `${origin}/blog/${blogId}`;
    window.open(url, "_blank");
  }, [blogId, origin]);

  const handlePublish = React.useCallback(() => {
    if (blog?.is_published === 1) {
      unpublishBlog();
    } else {
      publishBlog();
    }
  }, [blog, publishBlog, unpublishBlog]);

  return (
    <Dialog open={publishContext.isOpen} onOpenChange={publishContext.onClose}>
      <DialogContent
        className="bg-background dark:bg-[#181717] drop-shadow-lg rounded-lg"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-medium">Share</DialogTitle>
          <DialogDescription>Share your blog with others.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col gap-y-1">
              <Label>Status</Label>
              <span className="text-[0.8rem] text-muted-foreground">
                {blog?.is_published === 1
                  ? "This blog is currently published"
                  : "This blog is currently in draft"}
              </span>
            </div>
            <div
              className={cn(
                "flex items-center gap-x-2 rounded-md bg-muted p-1 px-2",
                blog?.is_published === 1 && "bg-sky-800"
              )}
            >
              {blog?.is_published === 1 ? (
                <Globe
                  className={cn(
                    "h-4 w-4 text-muted-foreground",
                    blog?.is_published === 1 && "text-blue-400"
                  )}
                />
              ) : (
                <CircleCheck className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "text-sm text-muted-foreground",
                  blog?.is_published === 1 && "text-blue-400"
                )}
              >
                {blog?.is_published === 1 ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        </div>
        {blog?.is_published === 1 && (
          <div className="p-2 flex flex-col gap-y-2 rounded-lg border border-dashed border-muted-foreground/25">
            <div className="flex items-center gap-x-2">
              <Input
                type="text"
                readOnly
                className="text-muted-foreground focus-visible:ring-0 rounded-lg"
                value={`${origin}/blog/${blogId}`}
              ></Input>
              <Button
                size={"icon"}
                variant={"outline"}
                onClick={handleCopy}
                className="hover:bg-transparent rounded-lg"
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-x-2">
              <Button
                variant={"outline"}
                size={"lg"}
                className="w-full dark:bg-[#181717] hover:dark:bg-muted/50 rounded-lg"
                onClick={handleOpenInNewTab}
              >
                <Link className="h-4 w-4" />
                <span>Open in new tab</span>
              </Button>
            </div>
          </div>
        )}
        {/* a toggle button to change if they want to show on the explore page */}
        <div className="flex items-center justify-between">
          <div className="flex justify-between items-center gap-x-2 w-full">
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="airplane-mode">Show on explore page</Label>
              <span className="text-[0.8rem] text-muted-foreground">
                This will make your blog visible to other users on the explore
                page.
              </span>
            </div>
            <Switch
              id="airplane-mode"
              checked={blog?.is_on_explore === 1}
              onCheckedChange={showOnExpore}
            />
          </div>
        </div>
        <Button
          size={"lg"}
          className={cn(
            "w-full mt-6 rounded-lg",
            blog?.is_published === 1 &&
              "bg-muted/50 text-muted-foreground hover:bg-muted rounded-lg"
          )}
          onClick={handlePublish}
          disabled={isLoading}
        >
          {isLoading
            ? "Publishing..."
            : blog?.is_published === 1
              ? "Unpublish"
              : "Publish"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
