"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { useConvexAuth } from "convex/react";
import { Spinner } from "@/app/components/spinner";
import Link from "next/link";
import { SignInButton } from "@clerk/clerk-react";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Unleash Your Ideas. Structure With Simplicity.
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Transform your thoughts into beautifully structured notes and <br />{" "}
        documents with{" "}
        <span className={cn("font-bold logo-text-gradient", font.className)}>
          Sonnet
        </span>{" "}
        — effortlessly.
      </h3>
      <div className="flex items-center justify-center gap-x-4">
        <Button asChild size={"lg"} variant={"ghost"}>
          <Link href="/explore">Explore</Link>
        </Button>
        {isAuthenticated && !isLoading && (
          <Button asChild size={"lg"}>
            <Link href="/documents">
              Start Writing
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        )}
        {!isAuthenticated && (
          <SignInButton mode="modal">
            <Button size={"lg"}>
              Get Started
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
};
