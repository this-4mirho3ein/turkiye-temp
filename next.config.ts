import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["api.elan.ir"], // Allow both production and local IPs
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.elan.ir",
        pathname: "/api/upload/media/**",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
