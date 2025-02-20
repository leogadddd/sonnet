import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <h1 className={`logo-text font-bold text-3xl mb-0.5 ${font.className}`}>
        S
      </h1>
      <p className={cn("font-semibold", font.className)}>Sonnet</p>
    </div>
  );
};
