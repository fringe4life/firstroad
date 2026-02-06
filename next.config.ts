import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: !isDev,
  cacheComponents: true,
  serverExternalPackages: [
    "node:sqlite",
    "@better-auth/kysely-adapter",
    "better-auth/dist/db/adapter-kysely.mjs",
    "better-auth/dist/adapters/kysely-adapter/index.mjs",
    // any other low-level DB/driver packages you want to keep external
  ],
  experimental: {
    browserDebugInfoInTerminal: true,
    viewTransition: true,
    mcpServer: true,
    typedEnv: true,
    // lucide-react is already optimized by default, but explicit is fine
    // valibot has confirmed barrel file issues (GitHub #425)
    // this has basically slowed the dev server to a halt
    optimizePackageImports: isDev ? undefined : ["valibot", "lucide-react"],
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
