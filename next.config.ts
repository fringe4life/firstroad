import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    browserDebugInfoInTerminal: true,
    reactCompiler: true,
    devtoolSegmentExplorer: true,
    clientSegmentCache: true
  }
};

export default nextConfig;
