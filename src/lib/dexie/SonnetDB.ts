// AppDB.ts
import Dexie, { type EntityTable } from "dexie";
import Blog from "./blog";

export default class SonnetDB extends Dexie {
  blogs!: EntityTable<Blog, "id">;

  constructor() {
    super("SonnetDB");
    this.version(1).stores({
      blogs:
        "++id, blogId, [isPinned+isArchived+parentBlog], isPreview, isArchived, parentBlog",
    });
    this.blogs.mapToClass(Blog);
  }
}
