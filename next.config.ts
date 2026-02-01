import path from "node:path";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: !isDev,
  cacheComponents: true,
  webpack: (config, { dev }) => {
    // Only apply custom webpack config for production builds
    // This allows Turbopack to be used in development
    if (dev) {
      return config;
    }

    // Shim kysely adapter to prevent node:sqlite import errors during build
    // Required because better-auth bundles kysely as a hard dependency even when using /minimal
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
    browserDebugInfoInTerminal: true,
    viewTransition: true,
    mcpServer: true,
    typedEnv: true,
    // lucide-react is already optimized by default, but explicit is fine
    // valibot has confirmed barrel file issues (GitHub #425)
    // this has basically slowed the dev server to a halt
    optimizePackageImports: isDev ? undefined : ["valibot"],
  },
};

export default nextConfig;
