"use client";

import { useConvexAuth } from "convex/react";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

import { Logo } from "@/components/logo";
import { SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserItem from "@/app/(marketing)/components/user-item-marketing";
import { useTheme } from "next-themes";
import { ChevronRight, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { dark } from "@clerk/themes";

export const Navbar = () => {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        "z-50 dark:bg-[#181717] flex items-center justify-evenly p-6 w-full",
        scrolled && "shadow-sm"
      )}
    >
      <div className="flex justify-start flex-1 md:flex-none">
        <Logo />
      </div>

      {/* Centered navigation links */}
      <div className="flex-1 md:flex hidden justify-end space-x-4 pr-6 text-muted-foreground">
        <Button variant="ghost" size="sm" asChild className="h-9">
          <Link href="/explore">Explore</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild className="h-9">
          <Link href="/pricing">Pricing</Link>
        </Button>
      </div>

      {/* Right-aligned controls */}
      <div className="flex justify-end items-center gap-x-3">
        {!isAuthenticated && !isLoading && (
          <SignInButton
            mode="modal"
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
            }}
          >
            <Button variant={"ghost"} size={"sm"} className="rounded-lg h-9">
              Log In
            </Button>
          </SignInButton>
        )}
        {isAuthenticated && !isLoading && (
          <Button size={"sm"} className="rounded-lg" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        )}
        {!isAuthenticated && <ModeToggle />}
        <Navbar.MobileMenu />
        {isAuthenticated && !isLoading && <UserItem />}
      </div>
    </div>
  );
};

Navbar.MobileMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg flex md:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60 mt-2 rounded-xl"
        align="end"
        forceMount
      >
        <div className="flex flex-col gap-y-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="rounded-lg justify-start"
          >
            <Link href="/explore" className="flex justify-between">
              Explore <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="rounded-lg justify-start"
          >
            <Link href="/pricing" className="flex justify-between">
              Pricing <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
