import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { LogOut, ShieldUser, User } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ModeToggle } from "@/app/components/mode-toggle";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const UserItem = () => {
  const clerk = useClerk();
  const { user } = useUser();
  const { theme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex items-center justify-between text-sm"
        >
          <div className="gap-x-2 flex items-center max-w-[150px]">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.imageUrl} className="object-cover" />
            </Avatar>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 mt-2 rounded-xl bg-background dark:bg-[#181717] drop-shadow-md"
        align="end"
        forceMount
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
                  {user?.emailAddresses[0].emailAddress}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between px-3">
            <p className="text-xs">Appearance</p>
            <ModeToggle />
          </div>
          <DropdownMenuSeparator />
          <div className="w-full flex flex-col">
            <DropdownMenuItem className="cursor-pointer p-0">
              <Button
                variant={"ghost"}
                size={"sm"}
                className="w-full justify-start h-8 rounded-lg"
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
                className="w-full justify-start h-8 rounded-lg"
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
                className="w-full justify-start h-8 rounded-lg"
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
