"use client";

import React from "react";
import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const DocumentsPage = () => {
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({
      title: "New Blog",
    });

    toast.promise(promise, {
      loading: "Creating a new blog...",
      success: "New blog created!",
      error: "Failed to create a new blog.",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty-light.png"
        height="300"
        width="300"
        alt="empty image"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="empty image"
        className="hidden dark:block"
      />

      <h2 className="font-bold text-3xl uppercase">NO BLOG YET!</h2>
      <p className="text-center">
        It looks like there's nothing here... yet.
        <br /> Start fresh by adding your first blog below.
      </p>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4" />
        Create a blog
      </Button>
    </div>
  );
};

export default DocumentsPage;
