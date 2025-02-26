import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "files.edgestore.dev",
        protocol: "https",
      },
      {
        hostname: "npx-editor.vercel.app",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
