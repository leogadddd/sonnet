import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { getUser } from "../src/lib/utils";

// create a blog
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    parentBlog: v.optional(v.id("blogs")),
  },
  handler: async (ctx, args) => {
    const userId = await getUser({ ctx, args });

    // insert the blog
    const blog = await ctx.db.insert("blogs", {
      title: args.title,
      authorId: userId,
      parentBlog: args.parentBlog,
      contentData: {
        content: "",
        coverImage: "",
        icon: "",
        description: args.description ?? "",
        readTime: 0,
      },
      blogMeta: {
        tags: [],
        likes: 0,
        views: 0,
        publishedAt: undefined,
        isOnTrash: false,
        isArchived: false,
        isPublished: false,
        isOnExplore: false,
      },
      editorSettings: {
        isPreview: false,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // return the blog
    return blog;
  },
});

// update a blog
export const update = mutation({
  args: {
    id: v.id("blogs"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    parentBlog: v.optional(v.id("blogs")),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    likes: v.optional(v.number()),
    views: v.optional(v.number()),
    isOnTrash: v.optional(v.boolean()),
    isArchived: v.optional(v.boolean()),
    isOnExplore: v.optional(v.boolean()),
    isPublished: v.optional(v.boolean()),
    publishedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUser({ ctx, args });

    const blog = await ctx.db.get(args.id);

    // if there is no blog, throw an error
    if (!blog) {
      throw new Error("Blog not found");
    }

    // if the user is not the author of the blog, throw an error
    if (blog.authorId !== userId) {
      throw new Error("Unauthorized");
    }

    const options: Partial<Doc<"blogs">> = {
      title: args.title ?? blog.title,
      slug: args.slug ?? blog.slug,
      parentBlog: args.parentBlog ?? blog.parentBlog,
      contentData: {
        description: args.description ?? blog.contentData.description,
        content: args.content ?? blog.contentData.content,
        coverImage: args.coverImage ?? blog.contentData.coverImage,
        icon: args.icon ?? blog.contentData.icon,
      },
      blogMeta: {
        tags: args.tags ?? blog.blogMeta.tags,
        likes: args.likes ?? blog.blogMeta.likes,
        views: args.views ?? blog.blogMeta.views,
        isOnTrash: args.isOnTrash ?? blog.blogMeta.isOnTrash,
        isArchived: args.isArchived ?? blog.blogMeta.isArchived,
        isOnExplore: args.isOnExplore ?? blog.blogMeta.isOnExplore,
        isPublished: args.isPublished ?? blog.blogMeta.isPublished,
        publishedAt: args.publishedAt ?? blog.blogMeta.publishedAt,
      },
      updatedAt: Date.now(),
    };

    // update the blog
    const updatedBlog = await ctx.db.patch(args.id, options);

    // return the updated blog
    return updatedBlog;
  },
});

// delete a blog from the database
export const remove = mutation({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getUser({ ctx, args });

    const existingblog = await ctx.db.get(args.id);

    // if there is no blog, throw an error
    if (!existingblog) {
      throw new Error("Blog not found");
    }

    // if the user is not the author of the blog, throw an error
    if (existingblog.authorId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveRemove = async (blogId: Id<"blogs">) => {
      const children = await ctx.db
        .query("blogs")
        .withIndex("by_user_parent", (q) =>
          q.eq("authorId", userId).eq("parentBlog", blogId)
        )
        .collect();

      for (const child of children) {
        // delete the child first
        await ctx.db.delete(child._id);

        // then recursively delete its children
        await recursiveRemove(child._id);
      }
    };

    // first recursively delete all children
    await recursiveRemove(args.id);

    // then delete the parent blog
    const blog = await ctx.db.delete(args.id);

    return blog;
  },
});

// remove all blogs
export const removeAll = mutation({
  handler: async (ctx) => {
    const userId = await getUser({ ctx });

    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_user", (q) => q.eq("authorId", userId))
      .filter((q) => q.eq(q.field("blogMeta.isArchived"), true))
      .collect();

    for (const blog of blogs) {
      await ctx.db.delete(blog._id);
    }

    return blogs;
  },
});

// get a blog by id
export const getById = query({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.id);

    // if there is no blog, throw an error
    if (!blog) {
      throw new Error("Blog not found");
    }

    // if the blog is not archived and is published, return the blog
    // this is for public access
    if (!blog.blogMeta.isArchived && blog.blogMeta.isPublished) {
      return blog;
    }

    const userId = await getUser({ ctx, args });

    // if the user is not the author of the blog, throw an error
    if (userId !== blog.authorId) {
      throw new Error("Unauthorized");
    }

    // if the user is the author of the blog, return the blog
    return blog;
  },
});

// archive a blog or put the blog on the trash
export const archive = mutation({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getUser({ ctx, args });

    const existingBlog = await ctx.db.get(args.id);

    // if there is no blog, throw an error
    if (!existingBlog) {
      throw new Error("Blog not found");
    }

    // if the user is not the author of the blog, throw an error
    if (existingBlog.authorId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveArchive = async (blogId: Id<"blogs">) => {
      const children = await ctx.db
        .query("blogs")
        .withIndex("by_user_parent", (q) =>
          q.eq("authorId", userId).eq("parentBlog", blogId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          blogMeta: { ...child.blogMeta, isArchived: true },
        });

        await recursiveArchive(child._id);
      }
    };

    await recursiveArchive(args.id);

    const blog = await ctx.db.patch(args.id, {
      blogMeta: { ...existingBlog.blogMeta, isArchived: true },
    });

    return blog;
  },
});

// restore a blog from the trash
export const restore = mutation({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getUser({ ctx });

    const existingBlog = await ctx.db.get(args.id);

    // if there is no blog, throw an error
    if (!existingBlog) {
      throw new Error("Blog not found");
    }

    // if the user is not the author of the blog, throw an error
    if (existingBlog.authorId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveRestore = async (blogId: Id<"blogs">) => {
      const children = await ctx.db
        .query("blogs")
        .withIndex("by_user_parent", (q) =>
          q.eq("authorId", userId).eq("parentBlog", blogId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          blogMeta: { ...child.blogMeta, isArchived: false },
        });

        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<"blogs">> = {
      blogMeta: {
        isArchived: false,
      },
    };

    if (existingBlog.parentBlog) {
      const parentBlog = await ctx.db.get(existingBlog.parentBlog);

      if (parentBlog?.blogMeta.isArchived) {
        options.parentBlog = undefined;
      }
    }

    const blog = await ctx.db.patch(args.id, options);

    await recursiveRestore(args.id);

    return existingBlog;
  },
});

// archive all blogs
export const restoreAll = mutation({
  handler: async (ctx) => {
    const userId = await getUser({ ctx });

    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_user", (q) => q.eq("authorId", userId))
      .filter((q) => q.eq(q.field("blogMeta.isArchived"), true))
      .collect();

    for (const blog of blogs) {
      await ctx.db.patch(blog._id, {
        blogMeta: { ...blog.blogMeta, isArchived: false },
      });
    }

    return blogs;
  },
});

// get the list of blogs for the sidebar (not archived)
export const getSidebar = query({
  args: {
    parentBlog: v.optional(v.id("blogs")),
  },
  handler: async (ctx, args) => {
    const userId = await getUser({ ctx, args });

    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_user", (q) => q.eq("authorId", userId))
      .filter((q) => q.eq(q.field("blogMeta.isArchived"), false))
      .filter((q) => q.eq(q.field("parentBlog"), args.parentBlog))
      .order("desc")
      .collect();

    return blogs;
  },
});

// get the list of blogs in the trash
export const getTrash = query({
  handler: async (ctx) => {
    const userId = await getUser({ ctx });

    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_user", (q) => q.eq("authorId", userId))
      .filter((q) => q.eq(q.field("blogMeta.isArchived"), true))
      .order("desc")
      .collect();

    return blogs;
  },
});

// get the list of blogs by search query
export const getSearch = query({
  handler: async (ctx) => {
    const userId = await getUser({ ctx });

    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_user", (q) => q.eq("authorId", userId))
      .filter((q) => q.eq(q.field("blogMeta.isArchived"), false))
      .order("desc")
      .collect();

    return blogs;
  },
});

// remove the icon of a blog
export const removeIcon = mutation({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getUser({ ctx, args });

    const existingBlog = await ctx.db.get(args.id);

    if (!existingBlog) {
      throw new Error("Blog not found");
    }

    if (existingBlog.authorId !== userId) {
      throw new Error("Unauthorized");
    }

    const blog = await ctx.db.patch(args.id, {
      contentData: { ...existingBlog.contentData, icon: undefined },
    });

    return blog;
  },
});

// remove the cover image of a blog
export const removeCoverImage = mutation({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getUser({ ctx, args });

    const existingBlog = await ctx.db.get(args.id);

    if (!existingBlog) {
      throw new Error("Blog not found");
    }

    if (existingBlog.authorId !== userId) {
      throw new Error("Unauthorized");
    }

    const blog = await ctx.db.patch(args.id, {
      contentData: { ...existingBlog.contentData, coverImage: undefined },
    });

    return blog;
  },
});

// get the explore list of blogs
export const getExplore = query({
  args: {
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const blogs = await ctx.db
      .query("blogs")
      .filter((q) => q.eq(q.field("blogMeta.isArchived"), false))
      .filter((q) => q.eq(q.field("blogMeta.isPublished"), true))
      .filter((q) => q.eq(q.field("blogMeta.isOnExplore"), true))
      .filter((q) =>
        args.isFeatured ? q.eq(q.field("blogMeta.isFeatured"), true) : true
      )
      .order("desc")
      .collect();

    return blogs;
  },
});

export const setPreview = mutation({
  args: {
    id: v.id("blogs"),
    isPreview: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getUser({ ctx, args });

    const existingBlog = await ctx.db.get(args.id);

    if (!existingBlog) {
      throw new Error("Blog not found");
    }

    if (existingBlog.authorId !== userId) {
      throw new Error("Unauthorized");
    }

    const blog = await ctx.db.patch(args.id, {
      editorSettings: {
        ...existingBlog.editorSettings,
        isPreview: args.isPreview,
      },
    });

    return blog;
  },
});

export const isPreview = query({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.id);

    if (!blog) {
      throw new Error("Blog not found");
    }

    // If the blog is published, allow public access to preview status
    if (blog.blogMeta.isPublished) {
      return blog.editorSettings.isPreview;
    }

    // For unpublished blogs, verify user authorization
    const userId = await getUser({ ctx, args });
    if (blog.authorId !== userId) {
      throw new Error("Unauthorized");
    }

    return blog.editorSettings.isPreview;
  },
});

export const publish = mutation({
  args: {
    id: v.id("blogs"),
    isOnExplore: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getUser({ ctx, args });

    const existingBlog = await ctx.db.get(args.id);

    if (!existingBlog) {
      throw new Error("Blog not found");
    }

    if (existingBlog.authorId !== userId) {
      throw new Error("Unauthorized");
    }

    const blog = await ctx.db.patch(args.id, {
      blogMeta: {
        ...existingBlog.blogMeta,
        isOnExplore: args.isOnExplore,
        isPublished: true,
        publishedAt: Date.now(),
      },
    });

    return blog;
  },
});

export const unpublish = mutation({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getUser({ ctx, args });

    const existingBlog = await ctx.db.get(args.id);

    if (!existingBlog) {
      throw new Error("Blog not found");
    }

    if (existingBlog.authorId !== userId) {
      throw new Error("Unauthorized");
    }

    const blog = await ctx.db.patch(args.id, {
      blogMeta: {
        ...existingBlog.blogMeta,
        isPublished: false,
        publishedAt: undefined,
      },
    });

    return blog;
  },
});
