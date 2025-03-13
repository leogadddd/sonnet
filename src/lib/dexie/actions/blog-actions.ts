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
  sync: (blogId: string) => Promise<unknown>;
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
      const blogId = crypto.randomUUID();
      const formattedBlog = {
        title: blog.title || "New Blog",
        slug: blogId,
        blog_id: blogId,

        author_id: blog.authorId || "",
        parent_blog: blog.parentBlog || "",

        description: "",
        content: "",
        cover_image: "",
        icon: "",
        tags: [],

        likes: 0,
        views: 0,
        comments: 0,
        shares: 0,

        is_pinned: 0,
        is_featured: 0,
        is_published: 0,
        is_archived: 0,
        is_preview: 0,
        is_on_explore: 0,

        published_at: 0,
        created_at: Date.now(),
        updated_at: Date.now(),
        deleted_at: 0,
        synced_at: 0,
      };

      await db.blogs.add(formattedBlog);

      resolve(formattedBlog.blog_id);
    } catch (error) {
      reject(error);
    }
  });
};

blog.archive = async (blogId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.blogs.where("blog_id").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }

      const recursiveArchive = async (blogId: string) => {
        const children = await db.blogs
          .where("parent_blog")
          .equals(blogId)
          .toArray();
        for (const child of children) {
          await db.blogs.update(child.blog_id, { is_archived: 1 });

          await recursiveArchive(child.blog_id);
        }
      };

      await recursiveArchive(blogId);

      await db.blogs.update(blog.blog_id, {
        is_archived: 1,
        updated_at: Date.now(),
      });

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

blog.setPreview = async (blogId: string, isPreview: boolean) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.blogs.where("blog_id").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }
      await db.blogs.update(blog.blog_id, {
        is_preview: isPreview ? 1 : 0,
        updated_at: Date.now(),
      });

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

blog.update = async (blogId: string, updates: Partial<Blog>) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.blogs.where("blog_id").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }
      await db.blogs.update(blog.blog_id, {
        ...updates,
        updated_at: Date.now(),
      });

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

blog.setPinned = async (blogId: string, isPinned: boolean) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.blogs.where("blog_id").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }
      await db.blogs.update(blog.blog_id, {
        is_pinned: isPinned ? 1 : 0,
        updated_at: Date.now(),
      });

      resolve(blog);
    } catch (error) {
      reject(error);
    }
  });
};

blog.delete = async (blogId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.blogs.update(blogId, {
        deleted_at: Date.now(), // Soft delete
        updated_at: Date.now(),
      });

      const recursiveDelete = async (blogId: string) => {
        const children = await db.blogs
          .where("parent_blog")
          .equals(blogId)
          .toArray();

        for (const child of children) {
          await db.blogs.update(child.blog_id, {
            deleted_at: Date.now(), // Soft delete
            updated_at: Date.now(),
          });
          await recursiveDelete(child.blog_id);
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
      const blogs = await db.blogs.where("is_archived").equals(1).toArray();
      for (const blog of blogs) {
        await db.blogs.update(blog.blog_id, {
          deleted_at: Date.now(), // Soft delete
          updated_at: Date.now(),
        });
      }

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

blog.restore = async (blogId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.blogs.where("blog_id").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }

      const recursiveRestore = async (blogId: string) => {
        const children = await db.blogs
          .where("parent_blog")
          .equals(blogId)
          .toArray();

        for (const child of children) {
          await db.blogs.update(child.blog_id, {
            is_archived: 0,
            updated_at: Date.now(),
          });

          await recursiveRestore(child.blog_id);
        }
      };

      const options: Partial<Blog> = {
        is_archived: 0,
        updated_at: Date.now(),
      };

      if (blog.parent_blog) {
        const parentBlog = await db.blogs
          .where("blog_id")
          .equals(blog.parent_blog)
          .first();

        if (parentBlog?.is_archived) {
          options.parent_blog = "";
        }
      }

      await db.blogs.update(blog.blog_id, options);

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
      const blogs = await db.blogs.where("is_archived").equals(1).toArray();

      for (const blog of blogs) {
        const recursiveRestore = async (blogId: string) => {
          const children = await db.blogs
            .where("parent_blog")
            .equals(blogId)
            .toArray();

          for (const child of children) {
            await db.blogs.update(child.blog_id, {
              is_archived: 0,
              updated_at: Date.now(),
            });

            await recursiveRestore(child.blog_id);
          }
        };

        const options: Partial<Blog> = {
          is_archived: 0,
          updated_at: Date.now(),
        };

        if (blog.parent_blog) {
          const parentBlog = await db.blogs
            .where("blog_id")
            .equals(blog.parent_blog)
            .first();

          if (parentBlog?.is_archived) {
            options.parent_blog = "";
          }
        }

        await db.blogs.update(blog.blog_id, options);

        await recursiveRestore(blog.blog_id);
      }

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

blog.removeCoverImage = async (blogId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.blogs.where("blog_id").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }
      await db.blogs.update(blog.blog_id, {
        cover_image: "",
        updated_at: Date.now(),
      });

      resolve(unknown);
    } catch (error) {
      reject(error);
    }
  });
};

blog.publish = async (blogId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.blogs.where("blog_id").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }
      await db.blogs.update(blog.blog_id, {
        is_published: 1,
        published_at: Date.now(),
        updated_at: Date.now(),
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
      const blog = await db.blogs.where("blog_id").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }
      await db.blogs.update(blog.blog_id, {
        is_published: 0,
        published_at: 0,
        updated_at: Date.now(),
      });

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

blog.sync = async (blogId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await db.blogs.where("blog_id").equals(blogId).first();
      if (!blog) {
        reject(new Error("Blog not found"));
        return;
      }
      await db.blogs.update(blog.blog_id, {
        synced_at: Date.now(),
        updated_at: Date.now(),
      });

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

export const blogActions: BlogActions = blog;
