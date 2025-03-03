"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import SonnetFooter from "@/components/sonnet-footer";

const Footer = () => {
  return (
    <div className="flex items-center gap-x-8 w-full p-6 dark:bg-[#181717] z-50">
      <SonnetFooter />
      <div className="md:ml justify-end flex items-center gap-x-2 text-muted-foreground">
        <Button variant="ghost" size="sm" className="hover:bg-foreground/5">
          Privacy Policy
        </Button>
        <Button variant="ghost" size="sm" className="hover:bg-foreground/5">
          Terms & Conditions
        </Button>
      </div>
    </div>
  );
};

export default Footer;
