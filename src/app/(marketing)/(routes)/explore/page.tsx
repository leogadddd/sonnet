"use client";

import React from "react";
import ExploreList from "@/components/explore-list";

const ExplorePage = () => {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-start text-center gap-y-8 flex-1">
        <ExploreList />
      </div>
    </div>
  );
};

export default ExplorePage;
