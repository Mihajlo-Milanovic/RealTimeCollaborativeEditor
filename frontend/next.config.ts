import type { NextConfig } from "next";

const appInstance = process.env.APP_INSTANCE || "3000";

const nextConfig: NextConfig = {
  output: "standalone",
  distDir: `.next-${appInstance}`,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;