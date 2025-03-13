"use client";

import { useEffect, useState, ReactNode, useRef, createContext } from "react";
import useUser, { UserType } from "@/hooks/use-user";
import { useSession } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const UserContext = createContext<{ user: UserType | null }>({
  user: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useSession();

  const [isMounted, setIsMounted] = useState(false);
  const { user, setUser } = useUser();

  const _user = useQuery(api.users.getByClerkId, {
    clerkId: session?.user?.id || "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user && _user) {
      setUser(_user);
    }
  }, [session?.user, _user, setUser]);

  if (!isMounted) return null;

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useRef(UserContext);

  if (!context.current) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context.current;
};
