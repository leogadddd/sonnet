"use client";

import { Heading } from "@/components/heading";
import Footer from "@/components/footer";

const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col pt-24">
      <div className="flex flex-col items-center justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <Heading />
      </div>
      <Footer />
    </div>
  );
};

export default MarketingPage;
