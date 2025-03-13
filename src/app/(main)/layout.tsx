"use client";

import { useConvexAuth, useQuery } from "convex/react";
import React, { useEffect } from "react";
import { Spinner } from "@/components/spinner";
import { redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { SearchCommand } from "@/components/search-command";
import useUser from "@/hooks/use-user";
import { useSession } from "@clerk/nextjs";
import "@/styles/prose-mirror.css";
import { api } from "@/convex/_generated/api";

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { setUser } = useUser();
  const { session } = useSession();

  const user = useQuery(api.users.getByClerkId, {
    clerkId: session?.user?.id || "",
  });

  useEffect(() => {
    if (session?.user && user) {
      setUser(user);
    }
  }, [isAuthenticated, session?.user, user]);

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
