import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  experimental: {
    browserDebugInfoInTerminal: true,
    clientSegmentCache: true,
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
    cacheComponents: true,
    viewTransition: true,
  },
};

export default nextConfig;
