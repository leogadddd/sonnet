// Friend.ts

import { Entity } from "dexie";
import type SonnetDB from "./SonnetDB";

export default class Blog extends Entity<SonnetDB> {
  id!: number;
  blogId!: string;
  title!: string;
  slug!: string;
  authorId!: string;
  parentBlog!: string;

  description!: string;
  content!: string;
  coverImage!: string;
  icon!: string;

  tags!: string[];
  likes!: number;
  views!: number;
  comments!: number;
  shares!: number;

  isPinned!: number;
  isFeatured!: number;
  isPublished!: number;
  isArchived!: number;
  isPreview!: number;
  isOnExplore!: number;

  publishedAt!: number;
  createdAt!: number;
  updatedAt!: number;
}
