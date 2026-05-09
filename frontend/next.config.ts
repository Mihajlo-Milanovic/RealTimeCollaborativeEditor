import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const appInstance = process.env.APP_INSTANCE || "3000";

const nextConfig: NextConfig = {
  output: "standalone",
  distDir: `.next-${appInstance}`,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias['yjs'] = path.resolve(__dirname, 'node_modules/yjs');
    return config;
  },
};

export default nextConfig;