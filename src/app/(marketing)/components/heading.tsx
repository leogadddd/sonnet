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
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size={"lg"} />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href="/documents">
            Start Writing with Sonnet
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button>
            Get Sonnet Free
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};
