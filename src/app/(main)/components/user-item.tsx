"use client";

import React from "react";
import { AlertTriangle, LogOut, ShieldUser, User } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useSync } from "@/components/providers/sync-provider";
import { formatDate } from "@/lib/utils";
import { SyncText } from "@/app/components/syncbutton";
import useUser from "@/hooks/use-user";
import { Badge } from "@/app/components/ui/badge";

interface UserItemProps {
  isMobile: boolean;
}

const UserItem = ({ isMobile }: UserItemProps) => {
  const clerk = useClerk();
  const { user } = useUser();
  const { theme } = useTheme();

  if (!user) {
    return (
      <div className="flex items-center gap-x-2 text-sm p-4 select-none hover:bg-primary/5">
        <p className="text-sm text-red-500 flex items-center">
          <AlertTriangle className="h-6 w-6 mr-2" />
          Error loading User
        </p>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex items-center gap-x-2 text-sm p-4 select-none hover:bg-primary/5"
        >
          <div className="gap-x-2 flex items-center justify-center max-w-[150px]">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.imageUrl} className="object-cover" />
            </Avatar>
          </div>
          <div className="pointer-events-none">
            <div className="flex gap-x-2">
              <p className="text-sm">
                <span className="text-start font-bold w-full truncate">
                  {user?.username}
                </span>
              </p>
              {process.env.NODE_ENV === "development" && (
                <Badge
                  variant={"outline"}
                  className="px-2 text-muted-foreground py-0 text-xs"
                >
                  dev
                </Badge>
              )}
            </div>
            <SyncText />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 ml-2 mb-2 rounded-xl bg-background drop-shadow-lg dark:bg-[#181717]"
        align={isMobile ? "start" : "end"}
        side={isMobile ? "top" : "right"}
      >
        <div className="flex flex-col space-y-3 p-2">
          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-transparent p-1">
              <Avatar className="h-8-w-8">
                <AvatarImage src={user?.imageUrl} className="object-cover" />
              </Avatar>
            </div>
            <div className="space-y-0">
              <p className="text-sm line-clamp-1">
                <span className="text-start font-bold w-full truncate">
                  {user?.username}
                </span>
              </p>
              <p className="text-sm line-clamp-1">
                <span className="text-start font-normal w-full truncate text-muted-foreground">
                  {user?.email}
                </span>
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <div className="w-full flex flex-col">
            <DropdownMenuItem className="cursor-pointer p-0">
              <Button
                variant={"ghost"}
                size={"sm"}
                className="w-full justify-start h-8 rounded-xl"
                onClick={() => {}}
              >
                <User className="h-4 w-4 mr-2" />
                Manage Profile
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer p-0">
              <Button
                variant={"ghost"}
                size={"sm"}
                className="w-full justify-start h-8 rounded-xl"
                onClick={() =>
                  clerk.openUserProfile({
                    appearance: {
                      baseTheme: theme === "dark" ? dark : undefined,
                    },
                  })
                }
              >
                <ShieldUser className="h-4 w-4 mr-2" />
                Manage Account
              </Button>
            </DropdownMenuItem>
            <div className="h-2" />
            <DropdownMenuItem className="cursor-pointer p-0">
              <Button
                variant={"ghost"}
                size={"sm"}
                className="w-full justify-start h-8 rounded-xl"
                onClick={() => clerk.signOut()}
              >
                <LogOut className="h-4 w-4 mr-2 text-red-500" />
                <span className="text-red-500">Logout</span>
              </Button>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserItem;
