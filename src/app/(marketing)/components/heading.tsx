"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { useConvexAuth } from "convex/react";
import { Spinner } from "@/app/components/spinner";
import Link from "next/link";
import { SignInButton } from "@clerk/clerk-react";
import Image from "next/image";
import posthog from "posthog-js";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
        Write with Rhythm. Publish with Ease.
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Turn your thoughts to notes so fine, then publish them in perfect rhyme
        with{" "}
        <span className={cn("font-bold logo-text-gradient", font.className)}>
          Sonnet
        </span>{" "}
        — effortless, every time!
      </h3>
      <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-4 pt-6">
        <Button asChild size={"lg"} variant={"ghost"}>
          <Link href="/explore">Explore</Link>
        </Button>
        {isAuthenticated && !isLoading && (
          <Button asChild size={"lg"} className="rounded-lg">
            <Link
              href="/documents"
              onClick={() => posthog.capture("clicked Continue Writing")}
            >
              Continue Writing
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        )}
        {!isAuthenticated && (
          <SignInButton mode="modal" signUpFallbackRedirectUrl="/documents">
            <Button
              size={"lg"}
              className="rounded-lg"
              onClick={() => posthog.capture("clicked Begin Sonnet")}
            >
              Begin Your Sonnet
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </SignInButton>
        )}
      </div>

      <div className="relative md:pt-80 pt-32">
        <Image
          src="/open-book-dark.svg"
          alt="Open Book"
          width={765}
          height={765}
          className="hidden dark:block absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
        <Image
          src="/open-book-light.svg"
          alt="Open Book"
          width={765}
          height={765}
          className="dark:hidden block absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
      </div>
    </div>
  );
};
