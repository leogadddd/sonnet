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
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useEditor } from "@/hooks/use-editor";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useOrigin } from "@/hooks/use-origin";

export const PublishModal = () => {
  const params = useParams();
  const origin = useOrigin();

  const publishContext = usePublish();
  const { isShowOnExplore, isPublished, setIsShowOnExplore, setIsPublished } =
    useEditor();

  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const update = useMutation(api.blogs.update);
  const publish = useMutation(api.blogs.publish);
  const unpublish = useMutation(api.blogs.unpublish);

  const showOnExpore = React.useCallback(
    async (checked: boolean) => {
      try {
        setIsLoading(true);
        setIsShowOnExplore(checked);

        await update({
          id: params.blogId as Id<"blogs">,
          isOnExplore: checked,
        });
      } catch (error) {
        // Revert state on error
        setIsShowOnExplore(!checked);
        toast.error("Failed to update blog");
      } finally {
        setIsLoading(false);
      }
    },
    [params.blogId, update]
  );

  const publishBlog = React.useCallback(async () => {
    try {
      setIsLoading(true);
      await publish({
        id: params.blogId as Id<"blogs">,
        isOnExplore: isShowOnExplore,
      });
      setIsPublished(true);
      toast.success("Blog published");
    } catch (error) {
      toast.error("Failed to publish blog");
    } finally {
      setIsLoading(false);
    }
  }, [params.blogId, publish, isShowOnExplore]);

  const unpublishBlog = React.useCallback(async () => {
    try {
      setIsLoading(true);
      await unpublish({
        id: params.blogId as Id<"blogs">,
      });
      setIsPublished(false);
      toast.success("Blog unpublished");
    } catch (error) {
      toast.error("Failed to unpublish blog");
    } finally {
      setIsLoading(false);
    }
  }, [params.blogId, unpublish]);

  const handleCopy = React.useCallback(() => {
    setIsCopied(true);
    const url = `${origin}/blog/${params.blogId}`;
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
  }, [params.blogId, origin]);

  const handleOpenInNewTab = React.useCallback(() => {
    const url = `${origin}/blog/${params.blogId}`;
    window.open(url, "_blank");
  }, [params.blogId, origin]);

  const handlePublish = React.useCallback(() => {
    if (isPublished) {
      unpublishBlog();
    } else {
      publishBlog();
    }
  }, [isPublished, publishBlog, unpublishBlog]);

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
                {isPublished
                  ? "This blog is currently published"
                  : "This blog is currently in draft"}
              </span>
            </div>
            <div
              className={cn(
                "flex items-center gap-x-2 rounded-md bg-muted p-1 px-2",
                isPublished && "bg-sky-800"
              )}
            >
              {isPublished ? (
                <Globe
                  className={cn(
                    "h-4 w-4 text-muted-foreground",
                    isPublished && "text-blue-400"
                  )}
                />
              ) : (
                <CircleCheck className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "text-sm text-muted-foreground",
                  isPublished && "text-blue-400"
                )}
              >
                {isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        </div>
        {isPublished && (
          <div className="p-2 flex flex-col gap-y-2 rounded-lg border border-dashed border-muted-foreground/25">
            <div className="flex items-center gap-x-2">
              <Input
                type="text"
                readOnly
                className="text-muted-foreground focus-visible:ring-0 rounded-lg"
                value={`${origin}/blog/${params.blogId}`}
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
              checked={isShowOnExplore}
              onCheckedChange={showOnExpore}
            />
          </div>
        </div>
        <Button
          size={"lg"}
          className={cn(
            "w-full mt-6 rounded-lg",
            isPublished &&
              "bg-muted/50 text-muted-foreground hover:bg-muted rounded-lg"
          )}
          onClick={handlePublish}
          disabled={isLoading}
        >
          {isLoading ? "Publishing..." : isPublished ? "Unpublish" : "Publish"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
