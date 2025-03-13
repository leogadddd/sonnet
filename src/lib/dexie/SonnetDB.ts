// AppDB.ts
import Dexie, { type EntityTable } from "dexie";
import Blog from "./blog";

export default class SonnetDB extends Dexie {
  blogs!: EntityTable<Blog, "blog_id">;

  constructor() {
    super("SonnetDB");
    this.version(1).stores({
      blogs:
        "blog_id, [is_pinned+is_archived+parent_blog], is_preview, is_archived, parent_blog, [is_archived+deleted_at], updated_at, deleted_at",
    });
    this.blogs.mapToClass(Blog);
  }
}
