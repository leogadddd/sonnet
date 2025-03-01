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
    savedBlogs: v.optional(v.array(v.id("blogs"))),
    likedBlogs: v.optional(v.array(v.id("blogs"))),
    userMeta: v.optional(v.object({
      isVerified: v.optional(v.boolean()),
      isBanned: v.optional(v.boolean()),
      isDeleted: v.optional(v.boolean()),
      deletedAt: v.optional(v.number()),
    })),
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
  blogs: defineTable({
    title: v.string(),
    authorId: v.string(),
    slug: v.optional(v.string()),
    parentBlog: v.optional(v.id("blogs")),
    contentData: v.object({
      content: v.optional(v.string()),
      description: v.optional(v.string()),
      readTime: v.optional(v.number()),
      coverImage: v.optional(v.string()),
      icon: v.optional(v.string()),
    }),
    blogMeta: v.object({
      tags: v.optional(v.array(v.string())),
      likes: v.optional(v.number()),
      views: v.optional(v.number()),
      isOnTrash: v.optional(v.boolean()),
      isArchived: v.optional(v.boolean()),
      isPublished: v.optional(v.boolean()),
      isOnExplore: v.optional(v.boolean()),
      isFeatured: v.optional(v.boolean()),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["authorId"])
    .index("by_user_parent", ["authorId", "parentBlog"])
    .index("by_is_featured", ["blogMeta.isFeatured"])
    .index("by_is_published", ["blogMeta.isPublished"])
    .index("by_is_archived", ["blogMeta.isArchived"])
    .index("by_is_on_trash", ["blogMeta.isOnTrash"]),
});
