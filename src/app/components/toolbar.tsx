"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { IconPicker } from "@/components/icon-picker";
import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { ComponentRef, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  initialData: Doc<"blogs">;
  preview?: boolean;
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const update = useMutation(api.blogs.update);
  const removeIcon = useMutation(api.blogs.removeIcon);
  const coverImage = useCoverImage();

  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon,
    });
  };

  const onRemoveIcon = () => {
    removeIcon({
      id: initialData._id,
    });
  };

  return (
    <div className="pl-[54px] group relative pb-6">
      <Toolbar.Icon
        initialData={initialData}
        preview={preview || false}
        onIconSelect={onIconSelect}
        onRemoveIcon={onRemoveIcon}
      />
      <Toolbar.Bar
        initialData={initialData}
        preview={preview || false}
        onIconSelect={onIconSelect}
        coverImageOnOpen={coverImage.onOpen}
      />
      <Toolbar.Title
        initialData={initialData}
        preview={preview || false}
        update={update}
      />
      <Toolbar.Description
        initialData={initialData}
        preview={preview || false}
        update={update}
      />
    </div>
  );
};

Toolbar.Title = function Title({
  initialData,
  preview,
  update,
}: {
  initialData: Doc<"blogs">;
  preview: boolean;
  update: any; // Add proper type from your Convex setup
}) {
  const inputRef = useRef<ComponentRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initialData._id,
      title: value || "New Blog",
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  return (
    <>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onKeyDown={onKeyDown}
          onBlur={disableInput}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[9px] text-5xl font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf]"
        >
          {initialData.title}
        </div>
      )}
    </>
  );
};

Toolbar.Description = function Description({
  initialData,
  preview,
  update,
}: {
  initialData: Doc<"blogs">;
  preview: boolean;
  update: any; // Add proper type from your Convex setup
}) {
  const inputRef = useRef<ComponentRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.contentData.description);

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.contentData.description);
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initialData._id,
      description: value,
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  return (
    <>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onKeyDown={onKeyDown}
          onBlur={disableInput}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="pt-2 text-muted-foreground text-base bg-transparent break-words outline-none resize-none w-full"
        />
      ) : (
        <div
          onClick={enableInput}
          className="text-muted-foreground/40 text-base pb-[1px] pt-2 w-full"
        >
          <span
            className={cn(
              `opacity-0 group-hover:opacity-100 transition`,
              value && "opacity-100 text-muted-foreground"
            )}
          >
            {initialData.contentData.description || "Add a description..."}
          </span>
        </div>
      )}
    </>
  );
};

Toolbar.Icon = function Icon({
  initialData,
  preview,
  onIconSelect,
  onRemoveIcon,
}: {
  initialData: Doc<"blogs">;
  preview: boolean;
  onIconSelect: (icon: string) => void;
  onRemoveIcon: () => void;
}) {
  return (
    <>
      {!!initialData.contentData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition cursor-pointer">
              {initialData.contentData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant={"outline"}
            size={"icon"}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.contentData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.contentData.icon}</p>
      )}
    </>
  );
};

Toolbar.Bar = function Bar({
  initialData,
  preview,
  onIconSelect,
  coverImageOnOpen,
}: {
  initialData: Doc<"blogs">;
  preview: boolean;
  onIconSelect: (icon: string) => void;
  coverImageOnOpen: () => void;
}) {
  return (
    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
      {!initialData.contentData.icon && !preview && (
        <IconPicker onChange={onIconSelect} asChild>
          <Button
            className="text-muted-foreground text-xs "
            variant={"outline"}
            size={"sm"}
          >
            <Smile className="h-4 w-4 mr-2" />
            add Icon
          </Button>
        </IconPicker>
      )}
      {!initialData.contentData.coverImage && !preview && (
        <Button
          className="text-muted-foreground text-xs "
          variant={"outline"}
          size={"sm"}
          onClick={coverImageOnOpen}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          add cover
        </Button>
      )}
    </div>
  );
};
