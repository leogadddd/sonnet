import { DataModel } from "../../convex/_generated/dataModel";
import { clsx, type ClassValue } from "clsx";
import { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GetUserArgs {
  ctx: GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>;
  args?: any;
}

export async function getUser({ ctx, args }: GetUserArgs) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }

  const userId = identity.subject;

  return userId;
}

export function formatDate(date: number) {
  // using momentjs
  // return like this Jan 1, 2025
  // if its less than a day, return like this 12h ago, 1h ago, 1m ago
  // if its more than a day, return like this 1 day ago, 2 days ago
  // if its more than a week, return like this 1 week ago, 2 weeks ago
  // if its more than a month, return like this 1 month ago, 2 months ago
  // if its more than a year, return like this 1 year ago, 2 years ago

  const now = new Date();
  const postDate = new Date(date);

  const diffTime = Math.abs(now.getTime() - postDate.getTime());
  const diffHours = Math.round(diffTime / (1000 * 60 * 60));

  if (diffHours < 1) {
    return "1h ago";
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffHours < 48) {
    return "1 day ago";
  } else {
    return postDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  }
}
