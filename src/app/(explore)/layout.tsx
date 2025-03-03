"use client";

import React from "react";
import { Navbar } from "@/components/navbar-explore";
import { Spinner } from "../components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import Footer from "@/components/footer";

const ExploreLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return redirect("/");
  }
  return (
    <div className="flex flex-col h-full">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default ExploreLayout;
