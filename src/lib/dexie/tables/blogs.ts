import { Entity } from "dexie";
import type SonnetDB from "../db";
import uniqid from "uniqid";

export default class Blog extends Entity<SonnetDB> {
  id!: number;
  blogId!: string;
  title!: string;
  authorId!: string;
  slug?: string;
  parentBlog?: number;
  readTime?: number;

  content?: string;
  description?: string;
  coverImage?: string;
  icon?: string;

  tags?: string[];
  likes?: number;
  views?: number;
  comments?: number;
  shares?: number;

  isPinned?: boolean;
  isFeatured?: boolean;
  isPublished?: boolean;
  isArchived?: boolean;
  isPreview?: boolean;

  createdAt!: number;
  updatedAt!: number;

  async createBlog(blog: Blog) {
    const blogWithId = {
      ...blog,
      title: blog.title ?? "New Blog",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      blogId: blog.blogId ?? uniqid(),
    };

    await this.db.blogs.add(blogWithId);
  }

  async getBlog(blogId: string) {
    return await this.db.blogs.get({ blogId });
  }

  async getSidebarBlogs(parentBlog: number) {
    // get all blogs that have is not archived and is not deleted
    return await this.db.blogs
      .where(["isArchived", "isPinned"])
      .equals([0, 0])
      .toArray();
  }

  async getBlogByBlogId(blogId: string) {
    return await this.db.blogs.get({ blogId });
  }
}
