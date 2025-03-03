import React from "react";
import Tabslist from "@/components/tabs-list";
import BlogsList from "@/components/blogs-list";

const ExplorePage = () => {
  return (
    <div className="h-full">
      <Tabslist />
      <div className="flex md:gap-x-4">
        <BlogsList />
        <div></div>
      </div>
    </div>
  );
};

export default ExplorePage;
