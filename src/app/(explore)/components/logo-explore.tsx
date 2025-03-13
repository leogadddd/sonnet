import { Badge } from "@/app/components/ui/badge";
import Link from "next/link";
import React from "react";

interface LogoProps {
  linkTo?: string;
}

export const Logo = ({ linkTo }: LogoProps) => {
  return (
    <Link href={linkTo || "/"} className="flex items-end">
      <p className="text-2xl font-bold shrink-0 logo-text-gradient">Sonnet</p>
      {process.env.NODE_ENV === "development" && (
        <p className="pb-[1px] text-muted-foreground/75 text-xl">
          .<span className="font-bold">dev</span>
        </p>
      )}
    </Link>
  );
};
