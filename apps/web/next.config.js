import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sign-signal/shared", "@sign-signal/db"],
};

export default nextConfig;