"use client";

import { useConvexAuth } from "convex/react";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

import { Logo } from "@/components/logo";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserItem from "@/app/(marketing)/components/user-item-marketing";
import { useTheme } from "next-themes";
export const Navbar = () => {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        "z-50 bg-background fixed top-0 flex items-center justify-evenly w-full p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <div className="flex-1 flex justify-start">
        <Logo />
      </div>

      {/* Centered navigation links */}
      <div className="md:flex hidden flex-1 justify-center space-x-8">
        <Link
          className="text-muted-foreground hover:text-primary text-sm"
          href="/blogs"
        >
          Explore
        </Link>
        <Link
          className="text-muted-foreground hover:text-primary text-sm"
          href="/pricing"
        >
          Pricing
        </Link>
      </div>

      {/* Right-aligned controls */}
      <div className="flex-1 flex justify-end items-center gap-x-3">
        {!isAuthenticated && !isLoading && (
          <SignInButton mode="modal">
            <Button variant={"ghost"} size={"sm"} className="rounded-lg">
              Log In
            </Button>
          </SignInButton>
        )}
        {isAuthenticated && !isLoading && (
          <Button size={"sm"} className="rounded-lg" asChild>
            <Link href="/documents">Dashboard</Link>
          </Button>
        )}
        {!isAuthenticated && <ModeToggle />}
        {isAuthenticated && !isLoading && <UserItem />}
      </div>
    </div>
  );
};
