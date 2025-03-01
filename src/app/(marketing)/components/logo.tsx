import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import Link from "next/link";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-x-2">
      <h1
        className={`logo-text-gradient font-bold text-3xl mb-0.5 ${font.className}`}
      >
        S
      </h1>
      <p className={cn("font-semibold hidden md:block", font.className)}>
        Sonnet
      </p>
    </Link>
  );
};
