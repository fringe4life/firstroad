import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  cacheComponents: true,
  experimental: {
    browserDebugInfoInTerminal: true,
    viewTransition: true,
    mcpServer: true,
    typedEnv: true,
    // lucide-react is already optimized by default, but explicit is fine
    // valibot has confirmed barrel file issues (GitHub #425)
    optimizePackageImports: ["valibot"],
  },
};

export default nextConfig;
