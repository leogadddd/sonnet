import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    username: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    plan: v.object({
      currentPlan: v.string(),
      isPro: v.boolean(),
    }),
    savedBlogs: v.array(v.string()),
    likedBlogs: v.array(v.string()),
    userMeta: v.optional(
      v.object({
        isVerified: v.optional(v.boolean()),
        isBanned: v.optional(v.boolean()),
        isDeleted: v.optional(v.boolean()),
        deletedAt: v.optional(v.number()),
      })
    ),
    options: v.object({
      isDarkMode: v.optional(v.boolean()),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_username", ["username"])
    .index("by_is_deleted", ["userMeta.isDeleted"])
    .index("by_deleted_at", ["userMeta.deletedAt"]),
});
