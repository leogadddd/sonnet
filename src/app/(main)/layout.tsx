"use client";

import { useConvexAuth } from "convex/react";
import React, { useEffect } from "react";
import { Spinner } from "@/components/spinner";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { SearchCommand } from "@/components/search-command";
import "@/styles/prose-mirror.css";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/");
    }
  }, [isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-full flex dark:bg-[#181717] text-[#3f3f3f] dark:text-[#cfcfcf] overflow-hidden">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
