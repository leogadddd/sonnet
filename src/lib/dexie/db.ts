import Dexie, { type EntityTable } from "dexie";
import Blogs from "./tables/blogs";

const dbName = "SonnetDB";
const dbVersion = 1;

export default class SonnetDB extends Dexie {
  blogs!: EntityTable<Blogs>;

  constructor() {
    super(dbName);
    this.version(dbVersion).stores({
      blogs: "++id, blogId, updatedAt, authorId, slug, parentBlog",
    });
    this.blogs.mapToClass(Blogs);
  }
}

export const db = new SonnetDB();
