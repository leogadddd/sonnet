import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import Bloglist from "./blog-list";

type WorkspaceContextType = {
  isEmpty: boolean;
  setEmpty: (isEmpty: boolean) => void;
};

const WorkspaceContext = React.createContext<WorkspaceContextType | undefined>(
  undefined
);

export const useWorkspace = () => {
  const context = React.useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};

interface WorkspaceProps {
  onCreate: () => void;
  label: string;
  isMobile: boolean;
  isPinned?: boolean;
  disappearOnEmpty?: boolean;
}

const Workspace = ({
  onCreate,
  label,
  isMobile,
  isPinned,
  disappearOnEmpty = false,
}: WorkspaceProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEmpty, setEmpty] = useState(false);

  const handleOnCreate = () => {
    setIsOpen(true);
    onCreate();
  };

  // If disappearOnEmpty is true, check isEmpty
  // If disappearOnEmpty is false, always show titlebar
  const showTitlebar = disappearOnEmpty ? !isEmpty : true;

  return (
    <WorkspaceContext.Provider value={{ isEmpty, setEmpty }}>
      <div className="flex flex-col ">
        {showTitlebar && (
          <Workspace.titlebar
            label={label}
            isPinned={isPinned ?? false}
            isMobile={isMobile}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            handleOnCreate={handleOnCreate}
          />
        )}
        <div className="overflow-y-auto max-h-[calc(100vh-30rem)] overflow-x-hidden">
          <Bloglist pinned={isPinned} />
          <div className="h-2" />
        </div>
      </div>
    </WorkspaceContext.Provider>
  );
};

interface WorkspaceTitlebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleOnCreate: () => void;
  label: string;
  isPinned: boolean;
  isMobile: boolean;
}

Workspace.titlebar = ({
  label,
  isPinned,
  isMobile,
  isOpen,
  setIsOpen,
  handleOnCreate,
}: WorkspaceTitlebarProps) => {
  return (
    <div className="group flex items-center justify-between pl-4 pr-3 py-2">
      <p
        role="button"
        className="select-none text-xs text-muted-foreground font-bold w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
      </p>
      {!isPinned && (
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
      )}
    </div>
  );
};

export default Workspace;
