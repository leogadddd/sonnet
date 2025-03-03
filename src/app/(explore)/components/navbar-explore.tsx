"use client";

import { Logo } from "@/components/logo-explore";
import Searchbar from "@/components/searchbar";
import React from "react";
import { useConvexAuth } from "convex/react";
import { useTheme } from "next-themes";
import { SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { dark } from "@clerk/themes";
import { ModeToggle } from "@/app/components/mode-toggle";
import UserItem from "@/app/(marketing)/components/user-item-marketing";
import Link from "next/link";
import { Loader2, Pen } from "lucide-react";
export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { theme } = useTheme();
  return (
    <div className="flex justify-between items-center p-4 py-2 gap-x-3">
      <div className="flex items-center gap-x-3 md:gap-x-16">
        <Logo linkTo="/explore" />
        <Searchbar />
      </div>
      <div>
        <div className="flex justify-end items-center gap-x-3">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
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
              <Link href="/dashboard">
                <Pen className="w-4 h-4" />
                <span className="hidden md:block">Write</span>
              </Link>
            </Button>
          )}
          {!isAuthenticated && <ModeToggle />}
          {/* <Navbar.MobileMenu /> */}
          {isAuthenticated && !isLoading && <UserItem />}
        </div>
      </div>
    </div>
  );
};
