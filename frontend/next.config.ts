import type { NextConfig } from "next";
import { fileURLToPath } from 'node:url';

// const __dirname = fileURLToPath(new URL('.', import.meta.url));

const appInstance = process.env.APP_INSTANCE || "3000";

export const nextConfig: NextConfig = {
  output: "standalone",
  distDir: `.next-${appInstance}`,
  // webpack: (config) => {
  //   config.resolve.alias['yjs'] = path.resolve(__dirname, 'node_modules/yjs');
  //   return config;
  // },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      yjs: require.resolve('yjs'), // force a single instance
    };
    return config;
  },
};

export default nextConfig;