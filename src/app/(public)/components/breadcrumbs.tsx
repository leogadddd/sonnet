import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";

const Breadcrumbs = ({ blog }: { blog: Doc<"blogs"> }) => {
  return (
    <div className="w-full py-4 pt-8">
      <div className="mx-auto max-w-md lg:max-w-6xl md:max-w-4xl md:px-24">
        <div className="px-[54px]">
          <Breadcrumb className="flex items-center gap-x-2">
            <BreadcrumbList>
              <BreadcrumbItem className="text-sm text-muted-foreground">
                <BreadcrumbLink href="/explore">Explore</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-muted-foreground w-4" />
              <BreadcrumbItem className="text-sm text-foreground truncate cursor-pointer">
                {blog.title}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;
