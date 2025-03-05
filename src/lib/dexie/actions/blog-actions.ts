import { db } from "../db";
import type Blog from "../blog";
import { unknown } from "zod";

export interface BlogActions {
  // setters

  create: (blog: BlogCreate) => Promise<string | unknown>;
  archive: (blogId: string) => Promise<unknown>;
  setPreview: (blogId: string, isPreview: boolean) => Promise<unknown>;
  setPinned: (blogId: string, isPinned: boolean) => Promise<unknown>;
  update: (blogId: string, updates: Partial<Blog>) => Promise<unknown>;
  delete: (blogId: string) => Promise<unknown>;
  deleteAll: () => Promise<unknown>;
  restore: (blogId: string) => Promise<unknown>;
  restoreAll: () => Promise<unknown>;
  removeCoverImage: (blogId: string) => Promise<unknown>;
  publish: (blogId: string) => Promise<unknown>;
  unpublish: (blogId: string) => Promise<unknown>;
}

interface BlogCreate {
  title: string;
  authorId: string;
  parentBlog?: string;
}

const blog = () => {};

blog.create = async (blog: BlogCreate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const formattedBlog = {
        title: blog.title || "New Blog",
        slug: "",
        blogId: crypto.randomUUID(),

        authorId: blog.authorId || "",
        parentBlog: blog.parentBlog || "",

        description: "",
        content: "",
        coverImage: "",
        icon: "",
        tags: [],

        likes: 0,
        views: 0,
        comments: 0,
        shares: 0,

        isPinned: 0,
        isFeatured: 0,
        isPublished: 0,
        isArchived: 0,
        isPreview: 0,
        isOnExplore: 0,

        publishedAt: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await db.blogs.add(formattedBlog);

      resolve(formattedBlog.blogId);
    } catch (error) {
      reject(error);
    }
  });
};

blog.archive = async (blogId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.blogs.where("blogId").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }

      const recursiveArchive = async (blogId: string) => {
        const children = await db.blogs
          .where("parentBlog")
          .equals(blogId)
          .toArray();
        for (const child of children) {
          await db.blogs.update(child.id, { isArchived: 1 });

          await recursiveArchive(child.blogId);
        }
      };

      await db.blogs.update(blog.id, { isArchived: 1 });

      await recursiveArchive(blogId);

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

blog.setPreview = async (blogId: string, isPreview: boolean) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.blogs.where("blogId").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }
      await db.blogs.update(blog.id, { isPreview: isPreview ? 1 : 0 });
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

blog.update = async (blogId: string, updates: Partial<Blog>) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.blogs.where("blogId").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }
      await db.blogs.update(blog.id, updates);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

blog.setPinned = async (blogId: string, isPinned: boolean) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.blogs.where("blogId").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }
      await db.blogs.update(blog.id, { isPinned: isPinned ? 1 : 0 });
      resolve(blog);
    } catch (error) {
      reject(error);
    }
  });
};

blog.delete = async (blogId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.blogs.where("blogId").equals(blogId).delete();

      const recursiveDelete = async (blogId: string) => {
        const children = await db.blogs
          .where("parentBlog")
          .equals(blogId)
          .toArray();

        for (const child of children) {
          await db.blogs.delete(child.id);
          await recursiveDelete(child.blogId);
        }
      };

      await recursiveDelete(blogId);

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

blog.deleteAll = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.blogs.where("isArchived").equals(1).delete();
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

blog.restore = async (blogId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.blogs.where("blogId").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }

      const recursiveRestore = async (blogId: string) => {
        const children = await db.blogs
          .where("parentBlog")
          .equals(blogId)
          .toArray();

        for (const child of children) {
          await db.blogs.update(child.id, { isArchived: 0 });

          await recursiveRestore(child.blogId);
        }
      };

      const options: Partial<Blog> = {
        isArchived: 0,
      };

      if (blog.parentBlog) {
        const parentBlog = await db.blogs
          .where("blogId")
          .equals(blog.parentBlog)
          .first();

        if (parentBlog?.isArchived) {
          options.parentBlog = "";
        }
      }

      await db.blogs.update(blog.id, options);

      await recursiveRestore(blogId);

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

blog.restoreAll = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.blogs.where("isArchived").equals(1).delete();
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

blog.removeCoverImage = async (blogId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.blogs.where("blogId").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }
      await db.blogs.update(blog.id, { coverImage: "" });
      resolve(unknown);
    } catch (error) {
      reject(error);
    }
  });
};

blog.publish = async (blogId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.blogs.where("blogId").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }
      await db.blogs.update(blog.id, {
        isPublished: 1,
        publishedAt: Date.now(),
      });
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

blog.unpublish = async (blogId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.blogs.where("blogId").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }
      await db.blogs.update(blog.id, { isPublished: 0, publishedAt: 0 });
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

export const blogActions: BlogActions = blog;
