import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    imageUrl: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const isUserExists = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (isUserExists) {
      return isUserExists._id;
    }

    const user = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      imageUrl: args.imageUrl,
      username: args.username,
      plan: {
        currentPlan: "free",
        isPro: false,
      },
      savedBlogs: [],
      likedBlogs: [],
      userMeta: {
        isVerified: false,
        isBanned: false,
        isDeleted: false,
        deletedAt: -1,
      },
      options: {
        isDarkMode: false,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return user;
  },
});

export const update = mutation({
  args: {
    clerkId: v.string(),
    data: v.object({
      email: v.optional(v.string()),
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      username: v.optional(v.string()),
      currentPlan: v.optional(v.object({
        currentPlan: v.optional(v.string()),
        isPro: v.optional(v.boolean()),
      })),
      userMeta: v.optional(v.object({
        isVerified: v.optional(v.boolean()),
        isBanned: v.optional(v.boolean()),
        isDeleted: v.optional(v.boolean()),
        deletedAt: v.optional(v.number()),
      })),
      options: v.optional(v.object({
        isDarkMode: v.optional(v.boolean()),
      })),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, args.data);

    return user;
  },
});

export const getByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});

export const deleteUser = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      console.log("Webhook received for non-existent user");
      return null;
    }

    await ctx.db.patch(user._id, {
      userMeta: {
        isDeleted: true,
        deletedAt: Date.now(),
      },
      updatedAt: Date.now(),
    });

    return user;
  },
});
