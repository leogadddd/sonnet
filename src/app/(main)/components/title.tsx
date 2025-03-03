"use client";

import { useMutation } from "convex/react";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
interface TitleProps {
  initialData: Doc<"blogs">;
}

export const Title = ({ initialData }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const update = useMutation(api.blogs.update);

  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(initialData.title || "Untitled");

  const enableInput = () => {
    setTitle(initialData.title || "Untitled");
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    update({
      id: initialData._id,
      title: event.target.value,
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  const onBlur = () => {
    disableInput();
  };

  return (
    <div className="flex items-center gap-x-1 min-w-0">
      {!!initialData.contentData.icon && (
        <p className="text-xl mb-1 flex-shrink-0">
          {initialData.contentData.icon}
        </p>
      )}
      {isEditing ? (
        <Input
          className="h-9 px-2 focus-visible:ring-0 text-lg"
          ref={inputRef}
          onClick={enableInput}
          onKeyDown={onKeyDown}
          onChange={onChange}
          value={title}
          onBlur={onBlur}
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="text-lg p-1 h-9 px-2 font-bold w-full "
        >
          <span className="truncate block w-full text-[#2c2c2c] dark:text-[#dbdbdb]">
            {initialData.title}
          </span>
        </Button>
      )}
    </div>
  );
};

// eslint-disable-next-line react/display-name
Title.Skeleton = () => {
  return <Skeleton className="ml-2 h-7 w-20 rounded-md" />;
};
