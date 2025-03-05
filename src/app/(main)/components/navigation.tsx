"use client";

import { cn } from "@/lib/utils";
import {
  MenuIcon,
  Plus,
  Search,
  Settings,
  Trash,
  ChevronLeft,
  Telescope,
  Home,
} from "lucide-react";
import { usePathname, useParams } from "next/navigation";
import { ComponentRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "@/components/user-item";
import Item from "@/components/item";
import { toast } from "sonner";
import Bloglist from "@/app/(main)/components/blog-list";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { TrashBox } from "@/components/trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { Navbar } from "@/components/navbar-main";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Workspace from "@/components/workspace";

import { useDexie } from "@/app/components/providers/dexie-provider";

export const Navigation = () => {
  const router = useRouter();
  const settings = useSettings();
  const search = useSearch();
  const params = useParams();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 767px)");

  const { actions } = useDexie();

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ComponentRef<"aside">>(null);
  const navbarRef = useRef<ComponentRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      sidebarRef.current.style.opacity = "1";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      sidebarRef.current.style.opacity = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleCreate = async () => {
    const promise = actions.blog
      .create({
        title: "New Blog",
        authorId: "1",
      })
      .then((blogId) => {
        router.push(`/dashboard/${blogId}`);
      });

    toast.promise(promise, {
      loading: "Creating a new blog...",
      success: "New blog created!",
      error: "Failed to create a new blog.",
    });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full dark:bg-[#181717] bg-secondary overflow-y-auto relative flex w-60 flex-col z-[50] border-r border-r-secondary",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        {!isCollapsed && (
          <ChevronLeft
            onClick={collapse}
            role="button"
            className={cn(
              "hidden h-9 w-9 mr-2 text-muted-foreground absolute top-4 right-3 transition",
              isMobile && "block"
            )}
          />
        )}
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col">
            {/* Sonnet Title goes here */}
            <Link
              href="/dashboard"
              className="flex items-center gap-x-2 px-4 py-3 w-max"
            >
              <p className="text-2xl font-bold shrink-0 logo-text-gradient">
                Sonnet
              </p>
            </Link>
            <Item
              label="Explore"
              icon={Telescope}
              onClick={() => {
                router.push("/explore");
              }}
            />
            <div className="h-2" />
            <Item
              label="Search"
              icon={Search}
              isSearch
              onClick={search.onOpen}
            />
            <Item
              label="Settings"
              icon={Settings}
              isSettings
              onClick={settings.onOpen}
            />
          </div>
          <div className="h-2" />
          <Item
            label="Home"
            icon={Home}
            onClick={() => {
              router.push("/dashboard");
            }}
          />
          <Popover>
            <PopoverTrigger className="w-full">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72 ml-2 bg-background dark:bg-[#181717] drop-shadow-md rounded-xl"
              side={isMobile ? "bottom" : "right"}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
          <div className="mt-4 max-h-[calc(100vh-19rem)] overflow-y-hidden">
            <Workspace
              onCreate={handleCreate}
              label="Pinned"
              isMobile={isMobile}
              isPinned={true}
              disappearOnEmpty={true}
            />
            <Workspace
              onCreate={handleCreate}
              label="Blogs"
              isMobile={isMobile}
            />
          </div>
          <div className="flex-1" />
        </div>
        <UserItem isMobile={isMobile} />
        <div
          onMouseDown={handleMouseDown}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[51] left-60 w-[calc(100%-240px)] flex flex-col items-center",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params.blogId ? (
          <Navbar
            isCollapsed={isCollapsed}
            onResetWidth={resetWidth}
            collapse={collapse}
          />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {!isCollapsed && (
              <ChevronLeft
                onClick={collapse}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};
