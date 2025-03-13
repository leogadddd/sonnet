import { Entity } from "dexie";
import type SonnetDB from "./SonnetDB";

export default class Blog extends Entity<SonnetDB> {
  blog_id!: string;
  title!: string;
  slug!: string;
  author_id!: string;
  parent_blog!: string | null;

  description!: string;
  content!: string;
  cover_image!: string;
  icon!: string;

  tags!: string[];
  likes!: number;
  views!: number;
  comments!: number;
  shares!: number;

  is_pinned!: number;
  is_featured!: number;
  is_published!: number;
  is_archived!: number;
  is_preview!: number;
  is_on_explore!: number;

  published_at!: number;
  created_at!: number;
  updated_at!: number;
  deleted_at!: number;
  synced_at!: number;
}
