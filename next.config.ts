import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  cacheComponents: true,
  experimental: {
    browserDebugInfoInTerminal: true,
    viewTransition: true,
    mcpServer: true,
    authInterrupts: true,
    typedEnv: true,
  },
};

export default nextConfig;
