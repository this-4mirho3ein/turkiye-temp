import type { NextConfig } from "next";
import mainConfig from "./configs/mainConfig";

const nextConfig: NextConfig = {
  images: {
    domains: ["87.248.130.89", "192.168.1.6", "127.0.0.1", "193.151.141.74"], // Allow both production and local IPs
  },
  reactStrictMode: false,
};

export default nextConfig;
