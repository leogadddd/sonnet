import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import React, { useState } from "react";

interface WorkspaceProps {
  onCreate: () => void;
  label: string;
  children: React.ReactNode;
  isMobile: boolean;
}

const Workspace = ({ onCreate, label, children, isMobile }: WorkspaceProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleOnCreate = () => {
    setIsOpen(true);
    onCreate();
  };

  return (
    <div className="flex flex-col">
      <div className="group flex items-center justify-between pl-4 pr-3 py-2">
        <p role="button" className="select-none text-xs text-muted-foreground font-bold w-full" onClick={() => setIsOpen(!isOpen)}>{label}</p>
        <div
          role="button"
          onClick={handleOnCreate}
          className={cn(
            "opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600",
            isMobile && "opacity-100"
          )}
        >
          <Plus className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      {isOpen && (
          <>
            {children}
          </>
        )}
    </div>
  );
};

export default Workspace;
