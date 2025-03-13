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

export class TimeFormatter {
  static timeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "just now";
    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
}

export function getReadTime(jsonString: string) {
  const wordsPerMinute = 200;

  // Parse JSON
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (error) {
    throw new Error("Invalid JSON format");
  }

  // Function to extract text recursively
  function extractText(content: any[]): string {
    return content
      .map((block) => {
        if (block.type === "text") return block.text;
        if (block.content) return extractText(block.content);
        return "";
      })
      .join(" ");
  }

  // Extract and clean text
  const cleanedText = extractText(parsed.content).replace(/\s+/g, " ").trim();
  const wordCount = cleanedText.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);

  return readTime;
}
