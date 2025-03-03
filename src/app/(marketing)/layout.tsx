import React from "react";
import { Navbar } from "@/components/navbar-marketing";

const MarketingLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="h-full">{children}</main>
    </div>
  );
};

export default MarketingLayout;
