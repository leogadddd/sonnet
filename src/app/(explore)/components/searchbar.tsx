"use client";

import React, { useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/lib/utils";

const Searchbar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      role="button"
      className={cn(
        "flex items-center h-[32px] rounded-xl bg-secondary/10 border pl-4 pr-2 transition-all duration-300 cursor-text",
        isFocused ? "border-secondary" : "border-secondary/50"
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <Search className="w-4 h-4" />
      <Input
        ref={inputRef}
        placeholder="Search"
        className="w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default Searchbar;
