import { SupabaseClient } from "@supabase/supabase-js";
import SonnetDB from "../dexie/SonnetDB";
import Blog from "../dexie/blog";

class BlogSyncManager {
  db: SonnetDB;
  supabase: SupabaseClient;
  userId: string;

  constructor(db: SonnetDB, supabase: SupabaseClient, userId: string) {
    this.db = db;
    this.supabase = supabase;
    this.userId = userId;
  }

  async fetchCloudBlogs() {
    const { data, error } = await this.supabase
      .from("blogs")
      .select("*")
      .eq("author_id", this.userId);

    if (error) {
      console.error("[Sync] Error fetching blogs from cloud:", error);
      throw error;
    }

    return data;
  }

  async fetchLocalBlogs() {
    return await this.db.blogs.toArray();
  }

  async needsSync() {
    const _cloudBlogs = this.fetchCloudBlogs();
    const _localBlogs = this.fetchLocalBlogs();

    const [cloudBlogs, localBlogs] = await Promise.all([
      _cloudBlogs,
      _localBlogs,
    ]);

    for (const localBlog of localBlogs) {
      const cloudBlog = cloudBlogs.find((b) => b.blog_id === localBlog.blog_id);
      if (!cloudBlog || localBlog.updated_at > cloudBlog.updated_at) {
        return true;
      }
    }

    for (const cloudBlog of cloudBlogs) {
      const localBlog = localBlogs.find((b) => b.blog_id === cloudBlog.blog_id);
      if (!localBlog || cloudBlog.updated_at > localBlog.updated_at) {
        return true;
      }
    }
    return false;
  }

  async sync() {
    const cloudBlogs = await this.fetchCloudBlogs();
    const localBlogs = await this.fetchLocalBlogs();

    const sortedLocalBlogs = [...localBlogs].sort((a, b) => {
      if (!a.parent_blog) return -1;
      if (!b.parent_blog) return 1;
      return 0;
    });

    // Sync Local Blogs to Cloud
    for (const localBlog of sortedLocalBlogs) {
      const cloudBlog = cloudBlogs.find((b) => b.blog_id === localBlog.blog_id);
      if (!cloudBlog) {
        if (localBlog.deleted_at === 0) {
          await this.saveToCloud(localBlog);
        }
      } else {
        await this.resolveConflict(localBlog, cloudBlog);
      }
    }

    // Sync Cloud Blogs to Local
    for (const cloudBlog of cloudBlogs) {
      const localBlog = localBlogs.find((b) => b.blog_id === cloudBlog.blog_id);
      if (!localBlog) {
        if (cloudBlog.deleted_at === 0) {
          await this.saveToLocal(cloudBlog);
        }
      }
    }

    // Handle soft deletions
    await this.handleSoftDeletions(localBlogs, cloudBlogs);
  }

  async handleSoftDeletions(localBlogs: Blog[], cloudBlogs: Blog[]) {
    for (const localBlog of localBlogs) {
      if (localBlog.deleted_at > 0) {
        const cloudBlog = cloudBlogs.find(
          (b) => b.blog_id === localBlog.blog_id
        );
        if (cloudBlog) {
          await this.deleteFromCloud(localBlog.blog_id);
        }
        await this.deleteFromLocal(localBlog.blog_id);
      }
    }

    for (const cloudBlog of cloudBlogs) {
      if (cloudBlog.deleted_at > 0) {
        await this.deleteFromLocal(cloudBlog.blog_id);
      }
    }
  }

  async resolveConflict(localBlog: Blog, cloudBlog: Blog) {
    if (localBlog.deleted_at > 0 || cloudBlog.deleted_at > 0) {
      await this.handleSoftDeletions([localBlog], [cloudBlog]);
    } else if (localBlog.updated_at > cloudBlog.updated_at) {
      await this.saveToCloud(localBlog);
    } else if (cloudBlog.updated_at > localBlog.updated_at) {
      await this.saveToLocal(cloudBlog);
    }
  }

  async saveToCloud(blog: Blog) {
    if (blog.parent_blog === "") {
      blog.parent_blog = null;
    }

    const { error } = await this.supabase.from("blogs").upsert(blog);
    if (error) {
      console.error(
        `[Sync] Error saving blog '${blog.blog_id}' to cloud:`,
        error
      );
      throw error;
    }
  }

  async saveToLocal(blog: Blog) {
    if (blog.parent_blog === null) {
      blog.parent_blog = "";
    }

    blog.is_pinned = blog.is_pinned ? 1 : 0;
    blog.is_featured = blog.is_featured ? 1 : 0;
    blog.is_archived = blog.is_archived ? 1 : 0;
    blog.is_preview = blog.is_preview ? 1 : 0;
    blog.is_on_explore = blog.is_on_explore ? 1 : 0;
    blog.is_published = blog.is_published ? 1 : 0;

    try {
      await this.db.blogs.put(blog);
    } catch (error) {
      console.error(
        `[Sync] Error saving blog '${blog.blog_id}' to local DB:`,
        error
      );
      throw error;
    }
  }

  async deleteFromCloud(blogId: string) {
    const { error } = await this.supabase
      .from("blogs")
      .delete()
      .eq("blog_id", blogId);
    if (error) {
      console.error(
        `[Sync] Error deleting blog '${blogId}' from cloud:`,
        error
      );
      throw error;
    }
  }

  async deleteFromLocal(blogId: string) {
    try {
      await this.db.blogs.delete(blogId);
    } catch (error) {
      console.error(
        `[Sync] Error deleting blog '${blogId}' from local DB:`,
        error
      );
      throw error;
    }
  }
}

export default BlogSyncManager;
