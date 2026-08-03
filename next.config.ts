import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove the 'X-Powered-By: Next.js' response header for security hygiene.
  poweredByHeader: false,

  // Enable React Strict Mode to surface potential rendering issues during development.
  reactStrictMode: true,
};

export default nextConfig;

