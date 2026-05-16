import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Supabase images in next/image
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
