import Link from "next/link";
import React from "react";

interface LogoProps {
  linkTo?: string;
}

export const Logo = ({ linkTo }: LogoProps) => {
  return (
    <Link href={linkTo || "/"}>
      <p className="text-2xl font-bold shrink-0 logo-text-gradient">Sonnet</p>
    </Link>
  );
};
