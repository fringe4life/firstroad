import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "standalone",
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
    turbopackFileSystemCacheForDev: true,
  },
  turbopack: {
    resolveAlias: {
      // Shim Better Auth's Kysely adapter & related entry points so Turbopack
      // never touches node:sqlite or the real adapter bundle.
      "node:sqlite": "./src/shims/kysely-adapter.ts",
      "@better-auth/kysely-adapter": "./src/shims/kysely-adapter.ts",
      "better-auth/dist/db/adapter-kysely.mjs": "./src/shims/kysely-adapter.ts",
      "better-auth/dist/adapters/kysely-adapter/index.mjs":
        "./src/shims/kysely-adapter.ts",
    },
  },
};

export default nextConfig;
