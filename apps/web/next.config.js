/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ["@sign-signal/shared", "@sign-signal/db"],
};

module.exports = nextConfig;
