import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "files.edgestore.dev",
        protocol: "https",
      },
    ],
  },
  crossOrigin: "anonymous",
};

export default nextConfig;
