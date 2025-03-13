import { create } from "zustand";

// Define user type
export type UserType = {
  clerkId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  imageUrl: string;
  plan: { currentPlan: string; isPro: boolean };
  savedBlogs?: string[];
  likedBlogs?: string[];
  userMeta?: {
    isVerified?: boolean;
    isBanned?: boolean;
    isDeleted?: boolean;
    deletedAt?: number;
  };
  options?: {
    isDarkMode?: boolean;
  };
  createdAt: number;
  updatedAt: number;
} | null;

interface UserStore {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

const useUser = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUser;
