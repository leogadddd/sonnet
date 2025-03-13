"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import BlogCard from "./blog-card";
import Blog from "@/lib/dexie/blog";

const BlogList = () => {
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const client = createClient();
    const fetchBlogs = async () => {
      const { data, error } = await client
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .eq("is_archived", false)
        .eq("deleted_at", 0)
        .eq("is_on_explore", true);
      if (error) {
        console.error(error);
      } else {
        setBlogs(data);
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!blogs.length) {
    return (
      <div className="flex flex-col gap-y-4 w-full text-center">
        No blogs found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4 w-full">
      {blogs.map((blog) => (
        <div key={blog.blog_id}>
          <h1>{blog.title}</h1>
        </div>
        // <BlogCard key={blog.blog_id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
