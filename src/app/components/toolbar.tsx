"use client";

import { IconPicker } from "@/components/icon-picker";
import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, Tag, X } from "lucide-react";
import { ComponentRef, useRef, useState, useMemo } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";
import { cn } from "@/lib/utils";
import Blog from "@/lib/dexie/blog";
import { useDexie } from "./providers/dexie-provider";

interface ToolbarProps {
  initialData: Blog;
  preview?: boolean;
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const coverImage = useCoverImage();
  const { actions } = useDexie();

  const onIconSelect = (icon: string) => {
    actions.blog.update(initialData.blog_id, {
      icon,
    });
  };

  const onRemoveIcon = () => {
    actions.blog.update(initialData.blog_id, {
      icon: "",
    });
  };

  const onTitleChange = (title: string) => {
    actions.blog.update(initialData.blog_id, {
      title,
    });
  };

  const onDescriptionChange = (description: string) => {
    actions.blog.update(initialData.blog_id, {
      description,
    });
  };

  return useMemo(
    () => (
      <div className="w-full px-[54px] group relative pb-6">
        <Toolbar.Icon
          initialData={initialData.icon}
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
          initialData={initialData.title}
          onTitleChange={onTitleChange}
          preview={preview || false}
        />
        <Toolbar.Description
          initialData={initialData.description}
          onDescriptionChange={onDescriptionChange}
          preview={preview || false}
        />
      </div>
    ),
    [preview, onIconSelect, onRemoveIcon, coverImage.onOpen]
  );
};

Toolbar.Title = function Title({
  initialData,
  preview,
  onTitleChange,
}: {
  initialData: string;
  onTitleChange: (title: string) => void;
  preview: boolean;
}) {
  const inputRef = useRef<ComponentRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData);

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData);
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onInput = async (value: string) => {
    setValue(value);
    onTitleChange(value);
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
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none w-full"
        />
      ) : (
        <div
          onClick={enableInput}
          className="min-w-fit pb-[10px] text-5xl font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf]"
        >
          {initialData}
        </div>
      )}
    </>
  );
};

Toolbar.Description = function Description({
  initialData,
  onDescriptionChange,
  preview,
}: {
  initialData: string;
  onDescriptionChange: (description: string) => void;
  preview: boolean;
}) {
  const inputRef = useRef<ComponentRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData);

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData);
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onInput = (value: string) => {
    setValue(value);
    onDescriptionChange(value);
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
          className="px-[2px] pt-2 text-muted-foreground break-words outline-none text-base bg-transparent w-full resize-none"
        />
      ) : (
        <div
          onClick={preview ? undefined : enableInput}
          className={cn(
            "px-[3px] min-w-fit text-muted-foreground/40 text-base pb-[2px] pt-2 w-full",
            preview && "cursor-default"
          )}
        >
          <span
            className={cn(
              "transition break-words outline-none text-xs",
              preview
                ? "opacity-100 text-muted-foreground/50 text-base"
                : "opacity-0 group-hover:opacity-100",
              value &&
                !preview &&
                "opacity-100 text-muted-foreground/50 text-base"
            )}
          >
            {initialData || (preview ? "" : "add a description")}
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
  initialData: string;
  preview: boolean;
  onIconSelect: (icon: string) => void;
  onRemoveIcon: () => void;
}) {
  return (
    <div className="relative h-14">
      {!!initialData && !preview && (
        <div className="items-center gap-x-2 group/icon absolute -top-8 left-0">
          <div className="flex items-center">
            <IconPicker onChange={onIconSelect}>
              <p className="text-6xl hover:opacity-75 transition cursor-pointer">
                {initialData}
              </p>
            </IconPicker>
            <Button
              onClick={onRemoveIcon}
              className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
              variant={"ghost"}
              size={"icon"}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      {!!initialData && preview && (
        <div className="items-center gap-x-2 group/icon absolute -top-8 left-0">
          <p className="text-6xl">{initialData}</p>
        </div>
      )}
    </div>
  );
};

Toolbar.Bar = function Bar({
  initialData,
  preview,
  onIconSelect,
  coverImageOnOpen,
}: {
  initialData: Blog;
  preview: boolean;
  onIconSelect: (icon: string) => void;
  coverImageOnOpen: () => void;
}) {
  return (
    <div
      className={cn(
        "opacity-0 group-hover:opacity-100 flex items-center gap-x-1",
        preview && "py-0"
      )}
    >
      {!initialData.icon && !preview && (
        <IconPicker onChange={onIconSelect} asChild>
          <Button
            className="text-muted-foreground/40 text-xs"
            variant={"ghost"}
            size={"sm"}
          >
            <Smile className="h-4 w-4 mr-2" />
            add Icon
          </Button>
        </IconPicker>
      )}
      {!initialData.cover_image && !preview && (
        <Button
          className="text-muted-foreground/40 text-xs "
          variant={"ghost"}
          size={"sm"}
          onClick={coverImageOnOpen}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          add cover
        </Button>
      )}
      {/* {initialData.tags.length === 0 && !preview && (
        <Button
          className="text-muted-foreground/40 text-xs "
          variant={"ghost"}
          size={"sm"}
          onClick={coverImageOnOpen}
        >
          <Tag className="h-4 w-4 mr-2" />
          add tags
        </Button>
      )} */}
    </div>
  );
};
