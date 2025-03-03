"use client";

import { Button } from "@/app/components/ui/button";
import React, { useState } from "react";

type Tab = {
  label: string;
  value: string;
};

const tabs: Tab[] = [
  { label: "Explore", value: "explore" },
  // { label: "Featured", value: "featured" },
];

const Tabslist = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]);

  const handleTabClick = (tab: Tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="mt-4 md:mt-8 py-2 border-b">
      <div className="flex gap-x-2 mx-auto max-w-xl px-4 md:px-2">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            size={"sm"}
            variant={selectedTab.value === tab.value ? "default" : "ghost"}
            onClick={() => handleTabClick(tab)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Tabslist;
