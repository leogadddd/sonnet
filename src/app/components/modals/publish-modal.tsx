"use client";

import { usePublish } from "@/hooks/use-publish";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Globe } from "lucide-react";
import { Button } from "../ui/button";

export const PublishModal = () => {
  const publish = usePublish();



  return (
    <Dialog open={publish.isOpen} onOpenChange={publish.onClose}>
      <DialogContent className="bg-background dark:bg-[#181717] drop-shadow-lg rounded-lg">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-medium">Share</DialogTitle>
          <DialogDescription>
            Share your blog with others.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col gap-y-1">
              <Label>Status</Label>
              <span className="text-[0.8rem] text-muted-foreground">
                This blog is currently in draft.
              </span>
            </div>
            <div className="flex items-center gap-x-2 rounded-md bg-muted p-1 px-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Draft</span>
            </div>
          </div>
        </div>
        {/* a toggle button to change if they want to show on the explore page */}
        <div className="flex items-center justify-between">
          <div className="flex justify-between items-center gap-x-2 w-full">
            <div className="flex flex-col gap-y-1"> 
              <Label htmlFor="airplane-mode">Show on explore page</Label>
              <span className="text-[0.8rem] text-muted-foreground">
                This will make your blog visible to other users on the explore page.
              </span>
            </div>
            <Switch id="airplane-mode" />
          </div>
        </div>
        <Button size={"lg"} className="w-full mt-4 rounded-lg"> 
            Share 
        </Button>
      </DialogContent>
    </Dialog>
  );
};
