"use client";

import React, { ReactNode, useRef, useState, useEffect } from "react";
import * as motion from "motion/react-client";
import { useRouter } from "next/navigation";

interface sidebarcomponent {
  children?: ReactNode;
}

const SideBarComponent = ({ children }: sidebarcomponent) => {
  const router = useRouter();
  const [width, setWidth] = useState(224);
  const isResizingRef = useRef(false);
  const lastWidthRef = useRef(width);
  const prevMouseXRef = useRef(0);
  const limitCrossedRef = useRef(false);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarWidth", width.toString());
    }
  }, [width]);

  const handleMouseDown = (e: any) => {
    e.preventDefault();
    isResizingRef.current = true;
    setIsResizing(true);
    prevMouseXRef.current = e.clientX;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: any) => {
    if (!isResizingRef.current) return;
    e.preventDefault();

    const deltaX = e.clientX - prevMouseXRef.current;
    const newWidth = lastWidthRef.current + deltaX;

    if (newWidth <= 150) {
      limitCrossedRef.current = true;
      return;
    }
    if (newWidth >= 400) {
      limitCrossedRef.current = true;
      return;
    }

    if (limitCrossedRef.current) {
      if ((newWidth > 150 && deltaX > 0) || (newWidth < 400 && deltaX < 0)) {
        limitCrossedRef.current = false;
      } else {
        return;
      }
    }

    setWidth(newWidth);
    lastWidthRef.current = newWidth;
    prevMouseXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    setIsResizing(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div>
      <motion.div
        className="sticky top-0 z-[10] bg-[--color-dark-accent] border-r border-[--color-dark-accent-2] px-1"
        animate={{ width }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ width }}
      >
        <div
          className={`flex flex-col items-end absolute top-0 right-0 h-full w-3 cursor-ew-resize group`}
          onMouseDown={handleMouseDown}
        >
          <div
            className="h-full w-0.5 transition-all group-hover:bg-[--color-dark-accent-2] group-hover:w-1"
            style={{
              backgroundColor: isResizing ? "var(--color-dark-accent-2)" : "",
            }}
          ></div>
        </div>
        <div className="flex flex-col gap-1 h-screen">{children}</div>
      </motion.div>
    </div>
  );
};

export default SideBarComponent;
