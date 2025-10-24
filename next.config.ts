import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  cacheComponents: true,
  experimental: {
    browserDebugInfoInTerminal: true,
    clientSegmentCache: true,
    turbopackFileSystemCacheForDev: true,
    viewTransition: true,
    mcpServer: true,
  },
};

export default nextConfig;
