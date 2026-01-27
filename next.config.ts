import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  cacheComponents: true,
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    const kyselyShimPath = path.resolve(
      __dirname,
      "src/shims/kysely-adapter.ts",
    );
    config.resolve.alias["node:sqlite"] = false;
    config.resolve.alias["@better-auth/kysely-adapter"] = kyselyShimPath;
    config.resolve.alias["better-auth/dist/db/adapter-kysely.mjs"] =
      kyselyShimPath;
    config.resolve.alias["better-auth/dist/adapters/kysely-adapter/index.mjs"] =
      kyselyShimPath;
    return config;
  },
  experimental: {
    // browserDebugInfoInTerminal: true,
    viewTransition: true,
    mcpServer: true,
    typedEnv: true,
    // lucide-react is already optimized by default, but explicit is fine
    // valibot has confirmed barrel file issues (GitHub #425)
    // this has basically slowed the dev server to a halt
    // optimizePackageImports: ["valibot"],
  },
};

export default nextConfig;
