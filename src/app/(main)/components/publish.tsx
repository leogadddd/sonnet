"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useOrigin } from "@/hooks/use-origin";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Copy, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublishProps {
  initialData: Doc<"documents">;
}

export const Publish = ({ initialData }: PublishProps) => {
  const router = useRouter();
  const origin = useOrigin();
  const update = useMutation(api.documents.update);

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/blog/${initialData._id}`;

  const onPublish = () => {
    setIsSubmitting(true);
    const promise = update({
      id: initialData._id,
      isPublished: true,
    }).then(() => {
      setIsSubmitting(false);
      router.push(`/blog/${initialData._id}`);
    });

    toast.promise(promise, {
      loading: "Publishing...",
      success: "Blog published!",
      error: "Failed to publish blog.",
    });
  };

  const onUnpublish = () => {
    setIsSubmitting(true);
    const promise = update({
      id: initialData._id,
      isPublished: false,
    }).then(() => {
      setIsSubmitting(false);
    });

    toast.promise(promise, {
      loading: "Unpublishing...",
      success: "Blog unpublished!",
      error: "Failed to unpublish blog.",
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" className="">
          {initialData.isPublished ? "Published" : "Publish"}
          {initialData.isPublished && <Globe className="ml-1 text-sky-500" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="flex flex-col items-center justify-center gap-y-4">
            <div className="flex flex-col items-center justify-center gap-y-2 w-full">
              <div className="flex items-center gap-x-2 w-full mb-4 ">
                <Globe className="h-6 w-6 text-muted-foreground text-sky-500" />
                <p className="font-bold text-muted-foreground text-sky-500">
                  This Blog is Published
                </p>
              </div>
              <div className="flex items-center w-full">
                <input
                  className="flex-1 px-2  text-xs border rounded-l-md h-8 bg-muted truncate"
                  value={url}
                  disabled={true}
                />
                <Button
                  onClick={onCopy}
                  disabled={copied}
                  className="h-8 rounded-l-none"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              size="sm"
              className="w-full text-xs"
              onClick={onUnpublish}
              disabled={isSubmitting}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="font-bold text-muted-foreground mb-2">
              Publish this Blog
            </p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your work with others.
            </span>
            <Button
              size="sm"
              className="w-full text-xs"
              onClick={onPublish}
              disabled={isSubmitting}
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
