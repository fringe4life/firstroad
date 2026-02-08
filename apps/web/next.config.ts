import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: !isDev,
  cacheComponents: true,
  serverExternalPackages: ["@better-auth/kysely-adapter"],
  experimental: {
    browserDebugInfoInTerminal: true,
    viewTransition: true,
    mcpServer: true,
    typedEnv: true,
    // valibot has confirmed barrel file issues (GitHub #425)
    optimizePackageImports: isDev ? undefined : ["valibot"],
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
