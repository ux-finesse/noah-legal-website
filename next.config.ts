import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets `npm run dev` work through a VS Code forwarded port (dev tunnels).
  allowedDevOrigins: ["*.devtunnels.ms"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" }, // sample insight images
    ],
  },
};

export default nextConfig;
