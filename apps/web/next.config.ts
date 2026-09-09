import type { NextConfig } from "next";

const nextConfig = {
  cacheComponents: true,
  experimental: {
    mcpServer: true,
    // valibot has confirmed barrel file issues (GitHub #425)
    optimizePackageImports: ["valibot"],
    serverActions: {
      bodySizeLimit: "4mb",
    },
    turbopackFileSystemCacheForBuild: true,
    turbopackFileSystemCacheForDev: true,
    turbopackRustReactCompiler: true,
    typedEnv: true,
    useTypeScriptCli: true,
  },
  logging: {
    browserToTerminal: true,
  },
  partialPrefetching: true,
  reactCompiler: true,
  // Keep node:sqlite stubbed so Better Auth's unused sqlite path never loads.
  serverExternalPackages: [
    "pg",
    "@neondatabase/serverless",
    "@prisma/orm-postgres",
  ],
  // turbopack: {
  //   resolveAlias: {
  //     "node:sqlite": "./src/shims/kysely-adapter.ts",
  //   },
  // },
  // these settings are for docker builds
  // output: "standalone",
  // outputFileTracingRoot: path.join(import.meta.dirname, "../../"),
  // transpilePackages: ["@firstroad/utils", "@firstroad/db"],
  typedRoutes: true,
} satisfies NextConfig;

export default nextConfig;
