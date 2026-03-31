import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // these settings are for docker builds
  // output: "standalone",
  // outputFileTracingRoot: path.join(import.meta.dirname, "../../"),
  // transpilePackages: ["@firstroad/utils", "@firstroad/db"],
  typedRoutes: true,
  reactCompiler: !isDev,
  cacheComponents: true,
  // Kysely shim required: Bun 1.3.10 and Better Auth v1.5 do not fix the adapter incompatibility; keeps Vercel (Bun 1.3.6) and local builds working.
  serverExternalPackages: ["@better-auth/kysely-adapter"],
  experimental: {
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
      // never touches node:sqlite or the real adapter bundle (see comment above).
      "node:sqlite": "./src/shims/kysely-adapter.ts",
      "@better-auth/kysely-adapter": "./src/shims/kysely-adapter.ts",
      "better-auth/dist/db/adapter-kysely.mjs": "./src/shims/kysely-adapter.ts",
      "better-auth/dist/adapters/kysely-adapter/index.mjs":
        "./src/shims/kysely-adapter.ts",
    },
  },
  logging: {
    browserToTerminal: true,
  },
};

export default nextConfig;
