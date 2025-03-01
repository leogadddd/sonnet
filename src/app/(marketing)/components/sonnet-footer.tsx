import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Lightbulb } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

const writingTips = [
  "Write first, edit later.",
  "Keep your sentences concise.",
  "Use active voice for clarity.",
  "Vary sentence length for rhythm.",
  "Every word should serve a purpose.",
  "Read your writing aloud to refine it.",
  "Write day and night like you're running out of time.",
];

const getRandomTip = (lasttip: string): string => {
  let newTip;
  do {
    newTip = writingTips[Math.floor(Math.random() * writingTips.length)];
  } while (newTip === lasttip);
  return newTip;
};

export default function SonnetFooter() {
  const [tip, setTip] = useState(getRandomTip(""));

  useEffect(() => {
    const interval = setInterval(() => {
      setTip(getRandomTip(tip));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="flex items-center justify-start text-gray-400 text-sm w-full gap-x-4">
      {/* Writing Tip (Tooltip) */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="items-center space-x-2 text-xs cursor-help hidden md:flex text-muted-foreground hover:text-foreground">
            <Lightbulb className="w-4 h-4" />
            <span>Hover for a writing tip</span>
          </TooltipTrigger>
          <TooltipContent align="start">
            <p>{tip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Socials */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" asChild>
          <Link
            href="https://github.com/LeoooooGadil/npx-editor"
            target="_blank"
          >
            <FaGithub className="w-5 h-5 text-foreground dark:text-muted-foreground" />
          </Link>
        </Button>
      </div>
    </footer>
  );
}
