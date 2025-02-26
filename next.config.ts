import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "files.edgestore.dev",
        protocol: "https",
      },
      {
        hostname: "sonnet.leogadil.com",
        protocol: "https",
      },
    ],
  },
  crossOrigin: "anonymous",
};

export default nextConfig;
