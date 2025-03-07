"use client";

import { useConvexAuth } from "convex/react";
import React from "react";
import { Spinner } from "@/components/spinner";
import { redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { SearchCommand } from "../components/search-command";

import "@/styles/prose-mirror.css";

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size={"lg"} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <div className="h-full flex dark:bg-[#181717] overflow-hidden">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
