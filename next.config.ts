import type { NextConfig } from "next";
import mainConfig from "./configs/mainConfig";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "87.248.130.89",
      "192.168.1.6",
      "127.0.0.1",
      "193.151.141.74",
      "193.151.138.42",
    ], // Allow both production and local IPs
    remotePatterns: [
      {
        protocol: "http",
        hostname: "193.151.138.42",
        port: "3000",
        pathname: "/api/upload/media/**",
      },
      {
        protocol: "http",
        hostname: "87.248.130.89",
        port: "3000",
        pathname: "/api/upload/media/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.6",
        port: "3000",
        pathname: "/api/upload/media/**",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
