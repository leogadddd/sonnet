"use client";
import { useCallback, useEffect, useState } from "react";
import { File, Plus } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/use-search";
import { api } from "@/convex/_generated/api";
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";

export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const blogs = useQuery(api.blogs.getSearch);
  const create = useMutation(api.blogs.create);
  const [isMounted, setIsMounted] = useState(false);
  const [value, setValue] = useState("");
  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleValueChange = useCallback((text: string) => {
    setValue(text);
  }, []);

  const onSelect = useCallback((id: string) => {
    const blogId = id.split("-")[0];
    router.push(`/dashboard/${blogId}`);
    onClose();
  }, [router, onClose]);

  const handleOnOpenChange = useCallback((open: boolean) => {
    if (!open) {
      onClose();
    }

    setTimeout(() => {
      setValue("");
    }, 300);
  }, [onClose]);

  const handleCreateBlog = useCallback(() => {
    const titlePart = value.includes("-") ? value.split("-")[0].trim() : value.trim();
    const descriptionPart = value.includes("-") ? value.split("-").slice(1).join("-").trim() : "";
    
    if (!titlePart) return;

    const promise = create({
      title: titlePart,
      description: descriptionPart,
    }).then((blogId) => {
      router.push(`/dashboard/${blogId}`);
    });

    toast.promise(promise, {
      loading: "Creating blog...",
      success: "Blog created",
      error: "Failed to create blog",
    });
    onClose();
    setValue("");
  }, [value, create, router, onClose]);

  // This is key - we want to search only by the title part, ignoring the description
  const searchTerm = value.includes("-") ? value.split("-")[0].trim().toLowerCase() : value.toLowerCase();
  
  // Filter blogs based on search term
  const filteredBlogs = blogs?.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm)
  ) || [];

  // Prepare display values for the UI
  const displayTitle = value.includes("-") ? value.split("-")[0].trim() : value;
  const displayDescription = value.includes("-") ? value.split("-").slice(1).join("-").trim() : "";

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogTitle>
        <VisuallyHidden>Search</VisuallyHidden>
      </DialogTitle>
      <CommandInput
        placeholder={`Search ${user?.fullName}'s Sonnet...`}
        value={value}
        onValueChange={handleValueChange}
      />
      <CommandList>
        {/* Always show the create action group when there's input */}
        {value.trim() !== "" && (
          <CommandGroup heading="Actions">
            <CommandItem onSelect={handleCreateBlog} className="cursor-pointer rounded-lg">
              <Plus className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>Create new blog "{displayTitle}"</span>
                {displayDescription && (
                  <span className="text-muted-foreground text-xs">{`description: ${displayDescription}`}</span>
                )}
              </div>
            </CommandItem>
          </CommandGroup>
        )}
        
        {/* Only show blogs if we have results */}
        {filteredBlogs.length > 0 && (
          <CommandGroup heading="Blogs">
            {filteredBlogs.map((blog) => (
              <CommandItem
                key={blog._id}
                value={`${blog._id}-${blog.title}`}
                title={blog.title}
                onSelect={onSelect}
                className="cursor-pointer rounded-lg"
              >
                {blog.contentData.icon ? (
                  <p className="mr-2 text-[18px]">{blog.contentData.icon}</p>
                ) : (
                  <File className="mr-3 h-4 w-4" />
                )}
                <span>{blog.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        
        {/* Show empty state only when appropriate */}
        {filteredBlogs.length === 0 && value.trim() !== "" && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
      </CommandList>
    </CommandDialog>
  );
};