import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        // Vercel Blob CDN — public uploads stored via @vercel/blob
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        // Unsplash (legacy seed images already in DB)
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

